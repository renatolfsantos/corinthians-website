import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SHADER_CONFIG } from './shaderConfig'

interface ShaderBackgroundProps {
  onLoaded?: () => void
}

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uVideoResolution;
uniform float uTime;
uniform float uDensity;
uniform float uContrast;
uniform float uBrightness;
uniform float uDotMin;
uniform float uDotMax;
uniform float uDotSoftness;
uniform float uGrain;
uniform float uScanlines;
uniform float uMotion;
uniform vec3 uBackground;
uniform vec3 uShadow;
uniform vec3 uHighlight;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(
    sin(dot(p, vec2(127.1, 311.7))) * 43758.5453
  );
}

void main() {

  float screenAspect =
    uResolution.x / max(uResolution.y, 1.0);

  float videoAspect =
    uVideoResolution.x / max(uVideoResolution.y, 1.0);

  vec2 uv = vUv;

  if (screenAspect > videoAspect) {

    uv.y =
      (uv.y - 0.5) *
      videoAspect /
      screenAspect +
      0.5;

  } else {

    uv.x =
      (uv.x - 0.5) *
      screenAspect /
      videoAspect +
      0.5;

  }

  uv = clamp(uv, 0.001, 0.999);

  vec3 source =
    texture2D(uTexture, uv).rgb;

  float luminance =
    dot(
      source,
      vec3(0.299, 0.587, 0.114)
    );

  luminance =
    clamp(
      (luminance - uBrightness) *
      uContrast,
      0.0,
      1.0
    );

  luminance =
    smoothstep(
      0.0,
      0.8,
      luminance
    );

  vec2 grid =
    vec2(
      uDensity,
      uDensity /
      max(screenAspect, 0.1)
    );

  vec2 cell =
    fract(uv * grid) - 0.5;

  float radius =
    mix(
      uDotMin,
      uDotMax,
      luminance
    );

  float dotShape =
    1.0 -
    smoothstep(
      radius,
      radius + uDotSoftness,
      length(cell)
    );

  float grain =
    (
      hash(
        floor(uv * grid) +
        floor(uTime * uMotion)
      ) - 0.5
    ) * uGrain;

  float signal =
    clamp(
      dotShape + grain,
      0.0,
      1.0
    );

  vec3 dark =
    mix(
      uBackground,
      uShadow,
      luminance
    );

  vec3 green =
    mix(
      uShadow,
      uHighlight,
      luminance
    );

  vec3 color =
    mix(
      dark,
      green,
      signal
    );

  color +=
    sin(
      (uv.y + uTime * 0.03) *
      900.0
    ) * uScanlines;

  gl_FragColor =
    vec4(color, 1.0);
}

`

function ShaderScene({
  video,
}: {
  video: HTMLVideoElement
}) {
  const materialRef =
    useRef<THREE.ShaderMaterial | null>(null)

  const texture = useMemo(() => {
    const nextTexture =
      new THREE.VideoTexture(video)

    nextTexture.colorSpace =
      THREE.SRGBColorSpace

    nextTexture.minFilter =
      THREE.LinearFilter

    nextTexture.magFilter =
      THREE.LinearFilter

    nextTexture.generateMipmaps =
      false

    return nextTexture
  }, [video])

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  useFrame((state) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value =
      state.clock.getElapsedTime()
  })

  useEffect(() => {
    const updateResolution = () => {
      if (!materialRef.current) return

      materialRef.current.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      )
    }

    updateResolution()

    window.addEventListener(
      'resize',
      updateResolution
    )

    return () => {
      window.removeEventListener(
        'resize',
        updateResolution
      )
    }
  }, [])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: {
            value: texture,
          },

          uResolution: {
            value: new THREE.Vector2(1, 1),
          },

          uVideoResolution: {
            value: new THREE.Vector2(
              video.videoWidth || 1920,
              video.videoHeight || 1080
            ),
          },

          uTime: {
            value: 0,
          },

          uDensity: {
            value: SHADER_CONFIG.density,
          },

          uContrast: {
            value: SHADER_CONFIG.contrast,
          },

          uBrightness: {
            value: SHADER_CONFIG.brightness,
          },

          uDotMin: {
            value: SHADER_CONFIG.dot.minimum,
          },

          uDotMax: {
            value: SHADER_CONFIG.dot.maximum,
          },

          uDotSoftness: {
            value: SHADER_CONFIG.dot.softness,
          },

          uGrain: {
            value: SHADER_CONFIG.grain,
          },

          uScanlines: {
            value: SHADER_CONFIG.scanlines,
          },

          uMotion: {
            value: SHADER_CONFIG.motion,
          },

          uBackground: {
            value: new THREE.Color(
              SHADER_CONFIG.colors.background
            ),
          },

          uShadow: {
            value: new THREE.Color(
              SHADER_CONFIG.colors.shadow
            ),
          },

          uHighlight: {
            value: new THREE.Color(
              SHADER_CONFIG.colors.highlight
            ),
          },
        }}
      />
    </mesh>
  )
}

function ShaderBackground({
  onLoaded,
}: ShaderBackgroundProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const loadedRef =
    useRef(false)

  const [videoElement, setVideoElement] =
    useState<HTMLVideoElement | null>(null)

  const [autoplayBlocked, setAutoplayBlocked] =
    useState(false)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const notifyLoaded = () => {
      if (loadedRef.current) return

      loadedRef.current = true

      setVideoElement(video)

      onLoaded?.()
    }

    const playVideo = () => {
      video.muted = true

      if (!video.paused) return

      void video
        .play()
        .then(() => {
          setAutoplayBlocked(false)
        })
        .catch(() => {
          setAutoplayBlocked(true)
        })
    }

    const handleReady = () => {
      notifyLoaded()
      playVideo()
    }

    video.addEventListener(
      'loadeddata',
      handleReady
    )

    video.addEventListener(
      'canplay',
      handleReady
    )

    window.addEventListener(
      'pointerdown',
      playVideo,
      { passive: true }
    )

    if (video.readyState >= 2) {
      handleReady()
    }

    return () => {
      video.removeEventListener(
        'loadeddata',
        handleReady
      )

      video.removeEventListener(
        'canplay',
        handleReady
      )

      window.removeEventListener(
        'pointerdown',
        playVideo
      )
    }
  }, [onLoaded])

  const startVideo = () => {
    const video = videoRef.current

    if (!video) return

    video.muted = true

    void video
      .play()
      .then(() => {
        setAutoplayBlocked(false)
      })
      .catch(() => {
        setAutoplayBlocked(true)
      })
  }

  return (
    <>
      <video
        ref={videoRef}
        src="/0000-0530.mp4"
        muted
        loop
        playsInline
        autoPlay
        disablePictureInPicture
        controls={false}
        preload="auto"
        onPause={() =>
          setAutoplayBlocked(true)
        }
        className="video-surface"
        aria-hidden="true"
      />

      {autoplayBlocked ? (
        <button
          type="button"
          className="video-start"
          onClick={startVideo}
        >
          + Iniciar filme
        </button>
      ) : null}

      {videoElement ? (
        <Canvas
          className="shader-canvas"
          orthographic
          camera={{
            position: [0, 0, 1],
            zoom: 1,
          }}
          dpr={1}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) =>
            gl.setClearColor(
              '#020302',
              1
            )
          }
        >
          <ShaderScene
            video={videoElement}
          />
        </Canvas>
      ) : null}
    </>
  )
}

export default ShaderBackground