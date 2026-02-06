// Vercel Serverless Function - CNC G-Code Calculator
// File này chứa TẤT CẢ công thức tính toán

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, data } = req.body;

    try {
        let result;
        
        switch(type) {
            case 'drilling':
                result = calculateDrilling(data);
                break;
            case 'milling':
                result = calculateMilling(data);
                break;
            case 'circular':
                result = calculateCircular(data);
                break;
            default:
                return res.status(400).json({ error: 'Invalid calculation type' });
        }
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// ========== DRILLING CALCULATIONS ==========
function calculateDrilling(data) {
    const { pcd, holes, depth, height, rotation, cycle, qValue, machine } = data;
    
    const radius = parseFloat(pcd) / 2;
    const angleStep = 360 / parseInt(holes);
    const startAngle = parseFloat(rotation) || 0;
    
    const coords = [];
    for (let i = 0; i < parseInt(holes); i++) {
        const angle = (startAngle + i * angleStep) * (Math.PI / 180);
        const x = (radius * Math.cos(angle)).toFixed(3);
        const y = (radius * Math.sin(angle)).toFixed(3);
        coords.push({ x, y });
    }

    const drillingCmd = cycle === 'G83' 
        ? `${cycle} Z${parseFloat(depth).toFixed(3)} R${parseFloat(height).toFixed(3)} Q${parseFloat(qValue).toFixed(3)} F200.`
        : `${cycle} Z${parseFloat(depth).toFixed(3)} R${parseFloat(height).toFixed(3)} F200.`;

    const coordsText = coords.slice(1).map(c => `X${c.x} Y${c.y}`).join('\n');
    
    const gcode = generateDrillingGCode(machine, coords, drillingCmd, coordsText, depth);
    
    return {
        coords,
        gcode,
        radius
    };
}

function generateDrillingGCode(machine, coords, drillingCmd, coordsText, depth) {
    const templates = {
        takisawa: `%
G91G28Z0
G17G40G49G80
T4 (K10)
G0G90G57X0Y0 
M15
G43H04Z30. 
G90G92X0Y0Z30. 
M3S3200 
G0 X${coords[0].x} Y${coords[0].y}
${drillingCmd}
${coordsText}
G80
G0 Z30.
X0Y0
M5 
M9 
G91G28Z0 
M14
G91G28Y0 
M30 
%`,
        robodrill: `% 
G91G28Z0 
G0G17G40G49G80G90
M6 T4( K10)
G0G90G54X0Y0 
G43H54Z30. 
G90G92X0Y0Z30. 
M3S2200
M7 
G0 X${coords[0].x} Y${coords[0].y}
${drillingCmd}
${coordsText}
G80
G0 Z30.
X0Y0
M5 
M9 
G91G28Z0 
G91G28X0Y0 
M30 
%`,
        f54: `%
G91G28Z0
G17G40G49G80
G0G90G54X0Y0
G43H01Z10.
G90G92Z10.
M3S24000
Z10.
G1Z${parseFloat(depth).toFixed(3)}F300.
G0 X${coords[0].x} Y${coords[0].y}
${drillingCmd}
${coordsText}
G80
G0Z10.
X0Y0
G91G28Z0
G0Y80.
M72
M00
M99
%`,
        mitsu: `%
G91 G28 Z0
T6 (K6 )
G90 G0 G54 X0 Y0
G43 H06 Z10.
G90 G92 Z10.
M3 S4000
M8
G0 X${coords[0].x} Y${coords[0].y}
${drillingCmd}
${coordsText}
G80
G0 Z10.
X0 Y0
G91 G28 Z0
M5
M9
M30 
%`
    };

    return templates[machine] || templates.robodrill;
}

// ========== MILLING CALCULATIONS ==========
function calculateMilling(data) {
    const { hexHeight, toolDiameter, finishAllowance, leadInDistance, millingType, depth, feedRate, machine } = data;
    
    const H = parseFloat(hexHeight);
    const D = parseFloat(toolDiameter);
    const FA = parseFloat(finishAllowance);
    
    // Calculate TARGET hexagon vertices (actual part geometry)
    const targetCoords = [];
    for (let i = 0; i < 6; i++) {
        const angle = (30 + i * 60) * (Math.PI / 180);
        const x = (H * Math.cos(angle)).toFixed(3);
        const y = (H * Math.sin(angle)).toFixed(3);
        targetCoords.push({ x, y });
    }
    
    // Calculate FINISH PASS tool path
    let finishCoords;
    if (millingType === 'inside') {
        const H_finish = H + (D / 2);
        finishCoords = [];
        for (let i = 0; i < 6; i++) {
            const angle = (30 + i * 60) * (Math.PI / 180);
            const x = (H_finish * Math.cos(angle)).toFixed(3);
            const y = (H_finish * Math.sin(angle)).toFixed(3);
            finishCoords.push({ x, y });
        }
    } else {
        const H_finish = H - (D / 2);
        finishCoords = [];
        for (let i = 0; i < 6; i++) {
            const angle = (30 + i * 60) * (Math.PI / 180);
            const x = (H_finish * Math.cos(angle)).toFixed(3);
            const y = (H_finish * Math.sin(angle)).toFixed(3);
            finishCoords.push({ x, y });
        }
    }
    
    // Calculate ROUGH PASS tool path (if finish allowance > 0)
    let roughCoords = null;
    if (FA > 0) {
        if (millingType === 'inside') {
            const H_rough = H + (D / 2) + FA;
            roughCoords = [];
            for (let i = 0; i < 6; i++) {
                const angle = (30 + i * 60) * (Math.PI / 180);
                const x = (H_rough * Math.cos(angle)).toFixed(3);
                const y = (H_rough * Math.sin(angle)).toFixed(3);
                roughCoords.push({ x, y });
            }
        } else {
            const H_rough = H - (D / 2) - FA;
            roughCoords = [];
            for (let i = 0; i < 6; i++) {
                const angle = (30 + i * 60) * (Math.PI / 180);
                const x = (H_rough * Math.cos(angle)).toFixed(3);
                const y = (H_rough * Math.sin(angle)).toFixed(3);
                roughCoords.push({ x, y });
            }
        }
    }
    
    const gcode = generateMillingGCode(machine, finishCoords, depth, feedRate, toolDiameter, roughCoords, millingType, leadInDistance);
    
    return {
        targetCoords,
        finishCoords,
        roughCoords,
        gcode
    };
}

function generateMillingGCode(machine, finishCoords, depth, feedRate, toolDiameter, roughCoords, millingType, leadInDistance) {
    const depthFormatted = parseFloat(depth).toFixed(3);
    
    // ROUGH PASS SECTION
    let roughSection = '';
    if (roughCoords && roughCoords.length > 0) {
        let roughApproach = '';
        if (millingType === 'outside') {
            const v1 = roughCoords[0];
            const centerX = 0;
            const centerY = 0;
            const dx = parseFloat(v1.x) - centerX;
            const dy = parseFloat(v1.y) - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const approachX = (parseFloat(v1.x) + (dx / distance) * leadInDistance).toFixed(3);
            const approachY = (parseFloat(v1.y) + (dy / distance) * leadInDistance).toFixed(3);
            
            roughApproach = `G0 X${approachX} Y${approachY}
G0 Z5.
G1 Z${depthFormatted} F100.
G1 X${v1.x} Y${v1.y} F${feedRate}
`;
        } else {
            roughApproach = `G0 X0 Y0
G0 Z5.
G1 Z${depthFormatted} F100.
G1 X${roughCoords[0].x} Y${roughCoords[0].y} F${feedRate}
`;
        }
        
        let roughPathCoords;
        if (millingType === 'inside') {
            const reversedRough = [roughCoords[0], ...roughCoords.slice(1).reverse()];
            roughPathCoords = [...reversedRough, reversedRough[0]];
        } else {
            roughPathCoords = [...roughCoords, roughCoords[0]];
        }
        
        const roughPath = roughPathCoords.slice(1).map((c, i) => {
            return `X${c.x} Y${c.y}`;
        }).join('\n');
        
        roughSection = `${roughApproach}${roughPath}

`;
    }
    
    // FINISH PASS SECTION
    let finishSection = '';
    let finishPathCoords;
    if (millingType === 'inside') {
        const reversedCoords = [finishCoords[0], ...finishCoords.slice(1).reverse()];
        finishPathCoords = [...reversedCoords, reversedCoords[0]];
    } else {
        finishPathCoords = [...finishCoords, finishCoords[0]];
    }
    
    const finishPath = finishPathCoords.map((c, i) => {
        if (i === 0) {
            return `G1 X${c.x} Y${c.y} F${feedRate}`;
        }
        return `X${c.x} Y${c.y}`;
    }).join('\n');
    
    if (roughCoords && roughCoords.length > 0) {
        finishSection = `${finishPath}
`;
    } else {
        let finishApproach = '';
        if (millingType === 'outside') {
            const v1 = finishCoords[0];
            const centerX = 0;
            const centerY = 0;
            const dx = parseFloat(v1.x) - centerX;
            const dy = parseFloat(v1.y) - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const approachX = (parseFloat(v1.x) + (dx / distance) * leadInDistance).toFixed(3);
            const approachY = (parseFloat(v1.y) + (dy / distance) * leadInDistance).toFixed(3);
            
            finishApproach = `G0 X${approachX} Y${approachY}
G0 Z5.
G1 Z${depthFormatted} F100.
`;
        } else {
            finishApproach = `G0 X0 Y0
G0 Z5.
G1 Z${depthFormatted} F100.
G1 X${finishCoords[0].x} Y${finishCoords[0].y} F${feedRate}
`;
        }
        finishSection = `${finishApproach}${finishSection}
`;
    }
    
    const toolInfo = `D${toolDiameter} MILL`;

    const templates = {
        takisawa: `%
G91G28Z0
G17G40G49G80
T1(${toolInfo})
G0G90G57X0Y0
M15
G43H01Z30.
G90G92X0Y0Z30.
M3S3000
M8
${roughSection}
${finishSection}
G0 Z30.
X0Y0
M5
M9
G91G28Z0
M14
G91G28Y0
M30
%`,
        robodrill: `%
G91G28Z0
G0G17G40G49G80G90
M6 T1(${toolInfo})
G0G90G54X0Y0
G43H54Z30.
G90G92X0Y0Z30.
M3S2500
M7
${roughSection}
${finishSection}
G0 Z30.
X0Y0
M5
M9
G91G28Z0
G91G28X0Y0
M30
%`,
        f54: `%
G91G28Z0
G17G40G49G80
G0G90G54X0Y0
G43H01Z10.
G90G92Z10.
M3S5000
M8
${roughSection}
${finishSection}
G0Z10.
X0Y0
G91G28Z0
G0Y80.
M72
M00
M99
%`,
        mitsu: `%
G91 G28 Z0
T1 (${toolInfo})
G90 G0 G54 X0 Y0
G43 H01 Z10.
G90 G92 Z10.
M3 S3500
M8
${roughSection}
${finishSection}
G0 Z10.
X0 Y0
G91 G28 Z0
M5
M9
M30
%`
    };

    return templates[machine] || templates.robodrill;
}

// ========== CIRCULAR CALCULATIONS ==========
function calculateCircular(data) {
    const { pcd, centerX, centerY, toolDiameter, finishAllowance, circularDepth, circularFeedRate, cutType, machine } = data;
    
    const cx = parseFloat(centerX);
    const cy = parseFloat(centerY);
    const diameter = parseFloat(pcd);
    const toolDia = parseFloat(toolDiameter);
    const finishAllow = parseFloat(finishAllowance);
    
    let radius, roughRadius;
    
    if (cutType === 'inside') {
        radius = (diameter - toolDia) / 2;
        roughRadius = finishAllow > 0 ? (diameter - toolDia) / 2 + finishAllow : null;
    } else {
        radius = (diameter + toolDia) / 2;
        roughRadius = finishAllow > 0 ? (diameter + toolDia) / 2 - finishAllow : null;
    }
    
    const E6 = cx - radius;
    const E7 = cx + radius;
    const E8 = cy;
    
    const gcode = generateCircularGCode(machine, E6, E7, E8, cx, cy, circularDepth, circularFeedRate, toolDia, roughRadius, cutType);
    
    return {
        gcode,
        radius,
        roughRadius,
        E6,
        E7,
        E8,
        cx,
        cy
    };
}

function generateCircularGCode(machine, E6, E7, E8, cx, cy, depth, feedRate, toolDia, roughRadius, cutType) {
    const depthFormatted = parseFloat(depth).toFixed(3);
    
    let roughSection = '';
    if (roughRadius !== null) {
        const roughE6 = cutType === 'inside' ? (cx - roughRadius).toFixed(3) : (cx - roughRadius).toFixed(3);
        const roughE7 = cutType === 'inside' ? (cx + roughRadius).toFixed(3) : (cx + roughRadius).toFixed(3);
        
        roughSection = `G0 X${roughE6} Y${E8.toFixed(3)}
G0 Z5.
G1 Z${depthFormatted} F100.
G2 X${roughE7} I${roughRadius.toFixed(3)} F${feedRate}
G2 X${roughE6} I-${roughRadius.toFixed(3)}

`;
    }
    
    const radius = Math.abs(E7 - cx);
    const finishSection = `G0 X${E6.toFixed(3)} Y${E8.toFixed(3)}
${roughRadius === null ? `G0 Z5.
G1 Z${depthFormatted} F100.
` : ''}G2 X${E7.toFixed(3)} I${radius.toFixed(3)} F${feedRate}
G2 X${E6.toFixed(3)} I-${radius.toFixed(3)}
`;
    
    const toolInfo = `D${toolDia} MILL`;

    const templates = {
        takisawa: `%
G91G28Z0
G17G40G49G80
T1(${toolInfo})
G0G90G57X0Y0
M15
G43H01Z30.
G90G92X0Y0Z30.
M3S3000
M8
${roughSection}${finishSection}
G0 Z30.
X0Y0
M5
M9
G91G28Z0
M14
G91G28Y0
M30
%`,
        robodrill: `%
G91G28Z0
G0G17G40G49G80G90
M6 T1(${toolInfo})
G0G90G54X0Y0
G43H54Z30.
G90G92X0Y0Z30.
M3S2500
M7
${roughSection}${finishSection}
G0 Z30.
X0Y0
M5
M9
G91G28Z0
G91G28X0Y0
M30
%`,
        f54: `%
G91G28Z0
G17G40G49G80
G0G90G54X0Y0
G43H01Z10.
G90G92Z10.
M3S5000
M8
${roughSection}${finishSection}
G0Z10.
X0Y0
G91G28Z0
G0Y80.
M72
M00
M99
%`,
        mitsu: `%
G91 G28 Z0
T1 (${toolInfo})
G90 G0 G54 X0 Y0
G43 H01 Z10.
G90 G92 Z10.
M3 S3500
M8
${roughSection}${finishSection}
G0 Z10.
X0 Y0
G91 G28 Z0
M5
M9
M30
%`
    };

    return templates[machine] || templates.robodrill;
}
