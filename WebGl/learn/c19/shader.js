
const vt_shader = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightPosition;
uniform mat4 u_lightMatrix;
uniform mat4 u_normalMatrix;
uniform mat4 u_moveMatrix;

out vec3 v_normal;
out vec3 v_surfaceToLight;

void main () {
  gl_Position = u_moveMatrix * a_position;

  vec3 changedNormal = mat3(u_normalMatrix) * a_normal;
  // vec3 surfaceToLight = mat3(u_lightMatrix) * (u_lightPosition - vec3(gl_Position));
  vec3 surfaceWorldPosition = (u_lightMatrix * a_position).xyz;

  v_normal = changedNormal;
  // v_surfaceToLight = surfaceToLight;
  v_surfaceToLight = u_lightPosition - surfaceWorldPosition;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
out vec4 outColor;

uniform vec3 u_reversedLightDirection;
uniform vec3 u_surfaceColor;

void main () {
  float light = dot(normalize(v_normal), normalize(v_surfaceToLight));
  outColor = vec4(u_surfaceColor, 1.0);
  outColor.rgb *= light;
}
`