import { WebGLHelper } from './webgl_helper';
import * as dat from 'dat.gui';

export function rosette() {
    
    // 
    // Shaders Start (version has to be on the first line)
    // 
    const vs_script = `#version 300 es
        in vec3 coordinates;
        in vec3 color;
        uniform float pointSize;
        out vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            gl_PointSize = pointSize;
            vColor = vec4(color, 1.0);
        }
    `;

    const fs_script = `#version 300 es

        precision mediump float;
        in vec4 vColor;
        out vec4 fragColor;
        void main(void) {
            fragColor = vColor; 
        }
    `;
    // 
    // Shaders End
    // 

    let canvas = document.querySelector("#webgl-scene");
    let gl = WebGLHelper.initWebGL(canvas);

    let program = WebGLHelper.initShaders(gl, vs_script, fs_script);
    gl.useProgram(program);

    let coordinates = [];
    let color = [1, 0, 0];

    WebGLHelper.initBuffers(gl, program, [{
        name: 'coordinates',
        size: 3,
        data: coordinates
    }]);

    let radius = 1.0;
    let nPoints = 50;
    let pointCoordinates = [];
    let count = 0;

    // generate nPoints
    let i;
    for(i = 0; i < nPoints; i++){
        let pointX = radius * Math.cos(((2 * Math.PI) / nPoints) * i);
        let pointY = radius * Math.sin(((2 * Math.PI) / nPoints) * i);
        pointCoordinates.push([pointX, pointY]);
    }

    for(i = 0; i < nPoints; i++) {
        let j = 1;
        for(j; j < (nPoints - i); j++){
            // push each line
            coordinates.push(pointCoordinates[i][0]); // push x1
            coordinates.push(pointCoordinates[i][1]); // push y1
            coordinates.push(0.0); // push z
            coordinates.push(pointCoordinates[i + j][0]); // push x1
            coordinates.push(pointCoordinates[i + j][1]); // push y1
            coordinates.push(0.0); // push z
            count += 3;
        }
    }

    console.log(coordinates);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STATIC_DRAW);
    WebGLHelper.loadAttributeF(gl, program, 'color', color);
    WebGLHelper.loadUniformF(gl, program, 'pointSize', 5.0);
    WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0]);
    gl.drawArrays(gl.LINES, 0, count);

}