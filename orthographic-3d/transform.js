// init var
const initVars = {
    translation: [0, 0, 0],
    base: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    color: [Math.random(), Math.random(), Math.random(), 1],
    vertices: [
         // left column front
           0,   0,  0,
          30,   0,  0,
           0, 150,  0,
           0, 150,  0,
          30,   0,  0,
          30, 150,  0,

         // top rung front
          30,   0,  0,
         100,   0,  0,
          30,  30,  0,
          30,  30,  0,
         100,   0,  0,
         100,  30,  0,

         // middle rung front
          30,  60,  0,
          67,  60,  0,
          30,  90,  0,
          30,  90,  0,
          67,  60,  0,
          67,  90,  0,

         // left column back
           0,   0,  30,
          30,   0,  30,
           0, 150,  30,
           0, 150,  30,
          30,   0,  30,
          30, 150,  30,

         // top rung back
          30,   0,  30,
         100,   0,  30,
          30,  30,  30,
          30,  30,  30,
         100,   0,  30,
         100,  30,  30,

         // middle rung back
          30,  60,  30,
          67,  60,  30,
          30,  90,  30,
          30,  90,  30,
          67,  60,  30,
          67,  90,  30,

         // top
           0,   0,   0,
         100,   0,   0,
         100,   0,  30,
           0,   0,   0,
         100,   0,  30,
           0,   0,  30,

         // top rung right
         100,   0,   0,
         100,  30,   0,
         100,  30,  30,
         100,   0,   0,
         100,  30,  30,
         100,   0,  30,

         // under top rung
         30,   30,   0,
         30,   30,  30,
         100,  30,  30,
         30,   30,   0,
         100,  30,  30,
         100,  30,   0,

         // between top rung and middle
         30,   30,   0,
         30,   30,  30,
         30,   60,  30,
         30,   30,   0,
         30,   60,  30,
         30,   60,   0,

         // top of middle rung
         30,   60,   0,
         30,   60,  30,
         67,   60,  30,
         30,   60,   0,
         67,   60,  30,
         67,   60,   0,

         // right of middle rung
         67,   60,   0,
         67,   60,  30,
         67,   90,  30,
         67,   60,   0,
         67,   90,  30,
         67,   90,   0,

         // bottom of middle rung.
         30,   90,   0,
         30,   90,  30,
         67,   90,  30,
         30,   90,   0,
         67,   90,  30,
         67,   90,   0,

         // right of bottom
         30,   90,   0,
         30,   90,  30,
         30,  150,  30,
         30,   90,   0,
         30,  150,  30,
         30,  150,   0,

         // bottom
         0,   150,   0,
         0,   150,  30,
         30,  150,  30,
         0,   150,   0,
         30,  150,  30,
         30,  150,   0,

         // left side
         0,   0,   0,
         0,   0,  30,
         0, 150,  30,
         0,   0,   0,
         0, 150,  30,
         0, 150,   0,
    ],
    elements: [0, 1, 2, 0, 2, 3],
    vertCode: `#version 300 es
    // init position
    in vec3 a_position;
    // size of canvas
    uniform vec3 u_resolution;
    // translation
    uniform vec3 u_translation;
    // base
    uniform mat3 u_base;

    void main(void) {
        // base change
        vec3 basedPosition = u_base * a_position;

        // translate add
        vec3 position = (basedPosition + u_translation);

        // convert the position to 0-1 space
        vec3 unitSpaceCoordinate = position / u_resolution;

        // conver 0-1 to -1-1
        vec3 clipSpace = unitSpaceCoordinate * 2.0 - 1.0;

        gl_Position = vec4(clipSpace * vec3(1, -1, 1), 1.0);
    }
    `,
    fragmentCode: `#version 300 es
    precision highp float;

    out vec4 fragColor;
    void main(void) {
        fragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
    `
}

const dataGeneratedByInit = {
    gl: {
        gl: null,
        verticBuffer: null,
        elemBuffer: null,
        canvasElem: null,
        glslVarLocation: {}
    },
    eventVal: {
        moveCenter: {
            x: 0,
            y: 0
        }
    },
    control: {
        translate: {
            x: document.querySelector('#translate-x-change'),
            y: document.querySelector('#translate-y-change'),
            z: document.querySelector('#translate-z-change')
        },
        base: {
            x: document.querySelector('#base-x-change'),
            y: document.querySelector('#base-y-change'),
            z: document.querySelector('#base-z-change')
        }
    }
}

function initGL() {
    const canvasElem = document.querySelector('#my-canvas')
    dataGeneratedByInit.gl.canvasElem = canvasElem
    const gl = glUtils.getGlFromElement('#my-canvas')
    dataGeneratedByInit.gl.gl = gl
    
    const shaderProgram = gl.createProgram()
    const vertShader = glUtils.createShader(gl, gl.VERTEX_SHADER, initVars.vertCode)
    const fragmentShader = glUtils.createShader(gl, gl.FRAGMENT_SHADER, initVars.fragmentCode)
    attachShaderToProgram(gl, shaderProgram, vertShader, fragmentShader)
    glUtils.linkAndUseProgram(gl, shaderProgram)


    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position')
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution')
    const translationLocation = gl.getUniformLocation(shaderProgram, "u_translation")
    const baseLocation = gl.getUniformLocation(shaderProgram, 'u_base')
    dataGeneratedByInit.gl.glslVarLocation = {
        positionAttributeLocation, resolutionUniformLocation, translationLocation, baseLocation
    }

    const verticBuffer = glUtils.bufferData(gl, gl.ARRAY_BUFFER, new Float32Array(initVars.vertices), gl.STATIC_DRAW)
    dataGeneratedByInit.gl.verticBuffer = verticBuffer

    gl.bindBuffer(gl.ARRAY_BUFFER, verticBuffer)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation)
    drawScene()
}

function drawScene() {
    const gl = dataGeneratedByInit.gl.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, dataGeneratedByInit.gl.verticBuffer)

    gl.uniform3f(dataGeneratedByInit.gl.glslVarLocation.resolutionUniformLocation, 640, 640, 640)

    gl.uniform3fv(dataGeneratedByInit.gl.glslVarLocation.translationLocation, initVars.translation)

    gl.uniformMatrix3fv(dataGeneratedByInit.gl.glslVarLocation.baseLocation, false,initVars.base[0].concat(initVars.base[1]).concat(initVars.base[2]))

    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
}

function initEvent() {
    dataGeneratedByInit.gl.canvasElem.onclick = moveToClickedPoint
    const translateControl = dataGeneratedByInit.control.translate
    const baseControl = dataGeneratedByInit.control.base

    translateControl.x.oninput = translateChange.bind(translateControl.x, 0)
    translateControl.y.oninput = translateChange.bind(translateControl.y, 1)
    translateControl.z.oninput = translateChange.bind(translateControl.z, 2)
    translateControl.x.value = initVars.translation[0]
    translateControl.y.value = initVars.translation[1]
    translateControl.z.value = initVars.translation[2]
    

    baseControl.x.oninput = baseChange.bind(baseControl.x, 0)
    baseControl.y.oninput = baseChange.bind(baseControl.y, 1)
    baseControl.z.oninput = baseChange.bind(baseControl.z, 2)

}

function baseChange(idx = 0) {
    const val = this.value
    if(/^(\+|\-)?\d+,(\+|\-)?\d+,(\+|\-)?\d+$/.test(val)) {
        console.log(val)
        initVars.base[idx] = this.value.split(',').map(p => parseInt(p))
        drawScene()
    }
}


function addMousemoveDraw() {
    dataGeneratedByInit.gl.canvasElem.onmousemove = moveToClickedPoint
}

function moveToClickedPoint(e) {
    initVars.translation[0] = e.offsetX
    initVars.translation[1] = e.offsetY
    moveToPoint()
}

function moveToPoint() {
    const translateControl = dataGeneratedByInit.control.translate
    translateControl.x.value = initVars.translation[0]
    translateControl.y.value = initVars.translation[1]
    drawScene()
}

function translateChange(idx = 0) {
    initVars.translation[idx] = parseInt(this.value)
    moveToPoint(...initVars.translation)
}

// rotation


initGL()
initEvent()

