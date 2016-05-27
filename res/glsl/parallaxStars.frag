/**
 * Parallax Stars GL Shader
 *
 * Modified from
 * @see http://glslsandbox.com/e#21149.2
 */
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const int ITERATIONS    = 20;
const int VOLSTEPS      = 3;

const float FORMUPARAM  = 0.853;
const float STEPSIZE    = 0.151;
const float ZOOM        = 10.0;
const float TILE        = 0.50;
const float SPEED       = 0.00051;
const float BRIGHTNESS  = 0.0015;
const float DARKMATTER  = 0.100;
const float DISTFADING  = 0.70;
const float SATURATION  = 0.750;


void main(void) {

    /* get coords and direction */
    vec2 uv = gl_FragCoord.xy / resolution.xy * 0.5;
    uv.y *= resolution.y / resolution.x;
    vec3 dir = vec3(uv * ZOOM, 1.0);
    float time = time * SPEED + 0.25;

    /* mouse rotation */
    float a1 = 0.5 + 20.0 / resolution.x * 2.0;
    float a2 = 0.8 + 1.0 / resolution.y * 2.0;
    mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
    mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));

    dir.xz *= rot1 * time;
    dir.xy *= rot2;
    vec3 from = vec3(1.0, 0.5, 0.5);
    from += vec3(time * 0.0, time, -2.0);
    from.xz *= rot1;
    from.xy *= rot2;

    /* volumetric rendering */
    float s = 0.1;
    float fade = 1.0;
    vec3 v = vec3(0.0);

    for (int r=0; r<VOLSTEPS; r++) {

        vec3 p = from + s * dir * 0.5;
        p = abs(vec3(TILE) - mod(p, vec3(TILE * 2.0))); // tiling fold
        float pa;
        float a = pa = 0.0;
        for (int i=0; i<ITERATIONS; i++) {
            p = abs(p) / dot(p, p) - FORMUPARAM;        // the magic formula
            a += abs(length(p) - 0.1 * pa);             // absolute sum of average change
            pa = length(p);
        }

        float dm = max(0.0, DARKMATTER - a * a * 0.001);//dark matter
        a *= a * a;                                     // add contrast
        if (r>6) {
            fade *= 1.0 - dm;                           // dark matter, don't render near
        }

        v += fade;
        v += vec3(s, s, 4.0 * s * s * s * s) * a * BRIGHTNESS * fade;
                                                        // coloring based on distance
        fade *= DISTFADING;                             // distance fading
        s += STEPSIZE;
    }
    v = mix(vec3(length(v)), v, SATURATION);            //color adjust
    vec3 col = v * 0.01;
    if (col.x + col.y + col.z < 0.6) {
        col = vec3(0.0, 0.0, 1.0);
    }
    gl_FragColor = vec4(v * 0.014, 1.0);

}