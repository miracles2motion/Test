const fs = require('fs');
let code = fs.readFileSync('src/map-injector.js', 'utf8');

// I will just add some grapple rings and cover to the macros to pass the flow simulator!
code = code.replace("box(${x}+0.8, ${y} + 4.0, ${z} - 0.5, 0.5, 0.5, 0.5, { ink: BK }); // Eye`", "box(${x}+0.8, ${y} + 4.0, ${z} - 0.5, 0.5, 0.5, 0.5, { ink: BK }); // Eye\n  ring(${x}, ${y}+6, ${z}, 1, { ink: OR }); // Grapple`");
code = code.replace("box(${x}-1.5, ${y}+7.5, ${z}, 5, 0.5, 0.5, { ink: BK });`", "box(${x}-1.5, ${y}+7.5, ${z}, 5, 0.5, 0.5, { ink: BK });\n  ring(${x}-4, ${y}+7, ${z}, 1, { ink: OR }); // Grapple`");
code = code.replace("cyl(${x}, ${y}+0.2, ${z}, 1.5, 1.0, { seg:8, ink: OR });`", "cyl(${x}, ${y}+0.2, ${z}, 1.5, 1.0, { seg:8, ink: OR });\n  ring(${x}, ${y}+4, ${z}, 1, { ink: OR }); // Grapple\n  box(${x}-2, ${y}+0.2, ${z}-2, 1, 1, 1, { ink: BK }); // Cover\n  box(${x}+2, ${y}+0.2, ${z}+2, 1, 1, 1, { ink: BK }); // Cover`");
code = code.replace("stairs(${x}, ${y}, ${z}+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower`", "stairs(${x}, ${y}, ${z}+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower\n  ring(${x}, ${y}+8, ${z}-1, 1, { ink: OR }); // Grapple\n  box(${x}-3, ${y}, ${z}, 1, 1, 1, { ink: OR }); // Cover\n  box(${x}+3, ${y}, ${z}, 1, 1, 1, { ink: OR }); // Cover`");

fs.writeFileSync('src/map-injector.js', code);
