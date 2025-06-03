// graphGenerator.js
import CustomFamilyEdge from './components/CustomFamilyEdge';
function determineLevelDelta(type, fromIsSubject) {
    switch (type) {
        case 'father':
        case 'mother':
            return fromIsSubject ? 1 : -1;
        case 'child':
            return fromIsSubject ? -1 : 1;
        case 'husband':
        case 'wife':
            return 0;
        default:
            return null;
    }
}

function buildRelationMap(relations) {
    const relationMap = {};

    for (const rel of relations) {
        const from = String(rel.person_from);
        const to = String(rel.person_to);
        const type = rel.relation_type_name.toLowerCase();

        if (!relationMap[from]) relationMap[from] = [];
        if (!relationMap[to]) relationMap[to] = [];

        relationMap[from].push({ id: to, type });
        relationMap[to].push({ id: from, type });
    }

    return relationMap;
}

export function generateGraphData(people, relations) {
    const relationMap = buildRelationMap(relations);
    const levels = {};
    const queue = [];
    const visited = new Set();

    const allIds = people.map(p => String(p.id));
    if (allIds.length === 0) return { nodes: [], edges: [] };

    const personMap = {};
    for (const p of people) {
        personMap[String(p.id)] = p;
    }

    const rootId = allIds[0];
    levels[rootId] = 0;
    queue.push(rootId);

    while (queue.length > 0) {
        const current = queue.shift();
        const currentLevel = levels[current];
        visited.add(current);

        const relatives = relationMap[current] || [];

        for (const rel of relatives) {
            const relativeId = rel.id;
            const type = rel.type;

            const raw = relations.find(r =>
                (String(r.person_from) === current && String(r.person_to) === relativeId) ||
                (String(r.person_to) === current && String(r.person_from) === relativeId)
            );

            const fromIsSubject = raw && String(raw.person_from) === current;
            const delta = determineLevelDelta(type, fromIsSubject);

            if (delta === null) continue;

            const targetLevel = currentLevel + delta;

            if (!(relativeId in levels)) {
                levels[relativeId] = targetLevel;
                queue.push(relativeId);
            }
        }
    }

    const levelsGrouped = {};
    for (const [id, level] of Object.entries(levels)) {
        if (!levelsGrouped[level]) levelsGrouped[level] = [];
        levelsGrouped[level].push(id);
    }

    const spouseMap = {};
    for (const rel of relations) {
        const type = rel.relation_type_name.toLowerCase();
        if (type === 'husband' || type === 'wife') {
            const from = String(rel.person_from);
            const to = String(rel.person_to);
            spouseMap[from] = to;
            spouseMap[to] = from;
        }
    }

    const nodePositions = {};
    const nodeWidth = 200;
    const nodeHeight = 200;
    const xSpacing = 40;
    const ySpacing = 150;
    const placed = new Set();

    for (const [levelStr, ids] of Object.entries(levelsGrouped)) {
        const level = parseInt(levelStr);
        let xCursor = 0;

        for (const id of ids) {
            if (placed.has(id)) continue;

            const spouseId = spouseMap[id];
            if (spouseId && ids.includes(spouseId) && !placed.has(spouseId)) {
                const person = personMap[id];
                const spouse = personMap[spouseId];
                if (!person || !spouse) continue;

                let husbandId, wifeId;
                if (person.gender === 'male' && spouse.gender === 'female') {
                    husbandId = id;
                    wifeId = spouseId;
                } else if (person.gender === 'female' && spouse.gender === 'male') {
                    husbandId = spouseId;
                    wifeId = id;
                } else {
                    // Если гендер не определён, ставим как попало
                    husbandId = id;
                    wifeId = spouseId;
                }

                nodePositions[husbandId] = {
                    x: xCursor,
                    y: level * (nodeHeight + ySpacing)
                };
                nodePositions[wifeId] = {
                    x: xCursor + nodeWidth + 10,
                    y: level * (nodeHeight + ySpacing)
                };
                xCursor += 2 * nodeWidth + 30;

                placed.add(husbandId);
                placed.add(wifeId);
            } else {
                nodePositions[id] = {
                    x: xCursor,
                    y: level * (nodeHeight + ySpacing)
                };
                xCursor += nodeWidth + xSpacing;
                placed.add(id);
            }
        }
    }

    const nodes = people.map(person => {
        const id = String(person.id);
        const pos = nodePositions[id] || { x: 0, y: 0 };
        return {
            id,
            type: 'person',
            position: pos,
            data: {
                full_name: person.full_name,
                birth_date: person.birth_date,
                death_date: person.death_date,
                url_img: person.url_img,
                gender: person.gender,
            }
        };
    });

    const edges = [];

    for (const rel of relations) {
        const type = rel.relation_type_name.toLowerCase();
        if (['brother', 'sister'].includes(type)) continue;

        let source = String(rel.person_from);
        let target = String(rel.person_to);
        let sourceHandle = null;
        let targetHandle = null;
        let edgeType = 'smoothstep'; // default
        const data = {};

        const genderSource = personMap[source]?.gender;
        const genderTarget = personMap[target]?.gender;

        const isParentRelation = type === 'father' || type === 'mother' || type === 'child';

        if (type === 'husband' || type === 'wife') {
            // Женим!
            if (genderSource === 'female' && genderTarget === 'male') {
                [source, target] = [target, source];
            }
            sourceHandle = 'right';
            targetHandle = 'left';

        } else if (isParentRelation) {
            // Генерация кастомной линии между родителями и ребёнком
            const childId = (type === 'child') ? source : target;
            const parentId = (type === 'child') ? target : source;

            const spouseId = spouseMap[parentId];
            const spousePosition = nodePositions[spouseId];

            if (spouseId && spousePosition) {
                // Меняем тип ребра
                edgeType = 'familyEdge';
                const parentPosition = nodePositions[parentId];
                const childPosition = nodePositions[childId];

                data.spouseX = spousePosition.x + nodeWidth / 2 - 45; // 45 - абсолютно необъяснимая погрешность, без этого минуса линия уезжает вправо
                data.spouseY = spousePosition.y + nodeHeight;
                data.sourceX = parentPosition.x + nodeWidth / 2;
                data.sourceY = parentPosition.y + nodeHeight;
                data.targetX = childPosition.x + nodeWidth / 2;
                data.targetY = childPosition.y;
            } else {
                // если нет второго родителя — обычная линия
                edgeType = 'smoothstep';
            }
        }

        edges.push({
            id: `${source}-${target}-${type}`,
            source,
            target,
            type: edgeType,
            sourceHandle,
            targetHandle,
            animated: edgeType !== 'familyEdge',
            label: type,
            style: { stroke: '#888' },
            labelStyle: { fontSize: 10, fill: '#444' },
            data,
        });
    }

    return { nodes, edges };
}
