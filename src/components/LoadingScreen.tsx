import { useEffect, useState } from "preact/hooks";
import { useResponsive } from "../hooks/useResponsive";
import { colors, fonts } from "../styles/theme";

interface LoadingScreenProps {
  onComplete: () => void;
  isDataLoaded: boolean;
}

export function LoadingScreen({ onComplete, isDataLoaded }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const { isMobile, isSmallMobile } = useResponsive();

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (isDataLoaded && minTimeElapsed) {
      const fadeTimer = setTimeout(() => setOpacity(0), 200);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 600);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isDataLoaded, minTimeElapsed, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        zIndex: 999,
        opacity,
        transition: "opacity 0.4s ease-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="visually-hidden">Loading game data</div>

      <div
        style={{
          fontFamily: fonts.headline,
          fontSize: isSmallMobile ? "32px" : isMobile ? "48px" : "64px",
          color: colors.text,
          marginBottom: isMobile ? "40px" : "60px",
          letterSpacing: isMobile ? "1px" : "2px",
          textTransform: "uppercase",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        Touchdown
      </div>

      <div
        style={{
          position: "relative",
          width: isSmallMobile ? "150px" : isMobile ? "180px" : "240px",
          height: isSmallMobile ? "150px" : isMobile ? "180px" : "240px",
          marginBottom: isMobile ? "30px" : "40px",
        }}
      >
        <svg
          width={isSmallMobile ? "150" : isMobile ? "180" : "240"}
          height={isSmallMobile ? "150" : isMobile ? "180" : "240"}
          viewBox="0 0 58 58"
          style={{
            filter: `drop-shadow(0 0 ${isMobile ? "6px" : "10px"} ${colors.strong})`,
          }}
        >
          <path
            fill={colors.strong}
            d="M50.554,0h-3.637C21.047,0,0,21.047,0,46.917v3.637C0,54.66,3.34,58,7.446,58h3.637C36.953,58,58,36.953,58,11.083V7.446 C58,3.34,54.66,0,50.554,0z M2,50.554v-3.637C2,22.149,22.149,2,46.917,2h3.637c1.265,0,2.427,0.437,3.353,1.164 c-7.562,2.278-14.041,4.664-19.662,7.667l-2.538-2.538c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.134,2.134 c-1.306,0.756-2.564,1.553-3.778,2.394l-2.942-2.942c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.714,2.714 c-1.167,0.88-2.291,1.811-3.375,2.796l-2.925-2.925c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.886,2.886 c-1.023,1.011-2.009,2.08-2.962,3.21l-2.51-2.51c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.658,2.658 c-0.885,1.138-1.742,2.337-2.57,3.602l-2.674-2.674c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.991,2.991 c-0.762,1.254-1.502,2.569-2.22,3.951l-2.356-2.356c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.829,2.829 c-0.657,1.354-1.296,2.773-1.92,4.251l-2.494-2.494c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l3.085,3.085 c-1.544,3.882-2.99,8.192-4.37,12.983C2.784,53.774,2,52.254,2,50.554z M56,11.083C56,35.851,35.851,56,11.083,56H7.446 c-0.57,0-1.12-0.089-1.637-0.252c1.307-4.579,2.672-8.697,4.112-12.412l2.371,2.371C12.488,45.902,12.744,46,13,46 s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414l-2.983-2.983c0.616-1.496,1.247-2.917,1.892-4.28l2.677,2.677 C15.488,39.902,15.744,40,16,40c0.256,0,0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414l-3.16-3.16 c0.709-1.399,1.436-2.728,2.184-3.988l2.562,2.562C18.488,33.902,18.744,34,19,34s0.512-0.098,0.707-0.293 c0.391-0.391,0.391-1.023,0-1.414l-2.9-2.9c0.82-1.282,1.665-2.493,2.536-3.636l2.95,2.95C22.488,28.902,22.744,29,23,29 s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414l-3.114-3.114c0.949-1.145,1.93-2.218,2.943-3.229l2.757,2.757 C26.488,23.902,26.744,24,27,24s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414l-2.725-2.725 c1.087-0.993,2.214-1.92,3.379-2.793l2.932,2.932C31.488,19.902,31.744,20,32,20s0.512-0.098,0.707-0.293 c0.391-0.391,0.391-1.023,0-1.414l-2.698-2.698c1.224-0.838,2.493-1.624,3.807-2.365l3.477,3.477C37.488,16.902,37.744,17,38,17 s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414l-3.056-3.056c5.656-2.93,12.14-5.179,19.673-7.412 C55.754,5.603,56,6.496,56,7.446V11.083z"
          />
        </svg>
      </div>

      <div
        style={{
          width: isSmallMobile ? "200px" : isMobile ? "280px" : "400px",
          maxWidth: "90%",
          height: isMobile ? "3px" : "4px",
          backgroundColor: colors.borderLight,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "30%",
            height: "100%",
            backgroundColor: colors.strong,
            boxShadow: `0 0 ${isMobile ? "3px" : "4px"} ${colors.strong}`,
            animation: "slide 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.02);
            }
          }

          @keyframes slide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(500%);
            }
          }
        `}
      </style>
    </div>
  );
}
