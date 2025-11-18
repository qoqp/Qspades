#version 330 core
out vec4 FragColor;
in vec2 texCoords;

uniform sampler2D screenTexture;



uniform float brightness = 0.0;
uniform float contrast = 1.2;
uniform float saturation = 1.2;
uniform float sharpness = 1.0f;


mat4 brightnessMatrix( float brightness )
{
    return mat4( 1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 brightness, brightness, brightness, 1 );
}

mat4 contrastMatrix( float contrast )
{
	float t = ( 1.0 - contrast ) / 2.0;
    
    return mat4( contrast, 0, 0, 0,
                 0, contrast, 0, 0,
                 0, 0, contrast, 0,
                 t, t, t, 1 );

}

mat4 saturationMatrix( float saturation )
{
    vec3 luminance = vec3( 0.3086, 0.6094, 0.0820 );
    
    float oneMinusSat = 1.0 - saturation;
    
    vec3 red = vec3( luminance.x * oneMinusSat );
    red+= vec3( saturation, 0, 0 );
    
    vec3 green = vec3( luminance.y * oneMinusSat );
    green += vec3( 0, saturation, 0 );
    
    vec3 blue = vec3( luminance.z * oneMinusSat );
    blue += vec3( 0, 0, saturation );
    
    return mat4( red,     0,
                 green,   0,
                 blue,    0,
                 0, 0, 0, 1 );
}


//CAS
vec3 srgb2lin(vec3 color)
{
	return color * color;    
}

vec3 lin2srgb(vec3 color)
{
 	return sqrt(color);   
}

// Contrast Adaptive Sharpening (CAS)
// Reference: Lou Kramer, FidelityFX CAS, AMD Developer Day 2019,
// https://gpuopen.com/wp-content/uploads/2019/07/FidelityFX-CAS.pptx
vec3 cas(sampler2D tex, ivec2 texcoord, float sharpness_knob)
{
    vec3 a = srgb2lin(texelFetch(tex, texcoord + ivec2(0, -1), 0).rgb);
    vec3 b = srgb2lin(texelFetch(tex, texcoord + ivec2(-1, 0), 0).rgb);
    vec3 c = srgb2lin(texelFetch(tex, texcoord + ivec2(0, 0), 0).rgb);
    vec3 d = srgb2lin(texelFetch(tex, texcoord + ivec2(1, 0), 0).rgb);
    vec3 e = srgb2lin(texelFetch(tex, texcoord + ivec2(0, 1), 0).rgb);

    float min_g = min(a.g, min(b.g, min(c.g, min(d.g, e.g))));
    float max_g = max(a.g, max(b.g, max(c.g, max(d.g, e.g))));
    float sharpening_amount = sqrt(min(1.0 - max_g, min_g) / max_g);
    float w = sharpening_amount * mix(-0.125, -0.2, sharpness_knob);

    return (w * (a + b + d + e) + c) / (4.0 * w + 1.0);
}




//alternate sharpening
float kernel[9] = float[]
(
	-0.5f,  -1.0f, -0.5f,
	-1.0f, 7.0f, -1.0f,
	-0.5f,  -1.0f, -0.5f
);


ivec2 offsets[9] = ivec2[]
(
	ivec2(-1,  1), ivec2( 0,    1), ivec2( 1,  1),
	ivec2(-1,  0), ivec2( 0,    0), ivec2( 1,  0),
	ivec2(-1, -1), ivec2( 0,   -1), ivec2( 1, -1)
);

vec3 sharpen(sampler2D tex, ivec2 texcoord, float sharpness_knob){
    vec3 col = vec3(0.0f);
    
	for(int i = 0; i < 9; i++)
		col += texelFetch(tex, texcoord.st + offsets[i], 0).rgb * kernel[i];
    
    return mix(texelFetch(tex, texcoord, 0).rgb, col, sharpness_knob);
}






void main()
{
    //get texture coordinates
    ivec2 texcoord = ivec2( texCoords * vec2(textureSize(screenTexture, 0)) );
    
    
    //apply sharpening
    vec3 color = sharpen(screenTexture, texcoord, sharpness);
    color = lin2srgb(color);

    
    //apply color correction in linear space  

    
    //convert to srgb
    FragColor = brightnessMatrix( brightness ) *
       	contrastMatrix( contrast ) * 
       	saturationMatrix( saturation ) *
       	vec4(color, 1.0f);
}