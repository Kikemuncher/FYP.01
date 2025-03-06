<div
  ref={containerRef}
  className="relative w-full h-screen overflow-y-auto bg-teal-700 snap-y snap-mandatory"
  onScroll={handleScroll}
  style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }}
>
  {/* ✅ Add a small margin-top so videos aren’t too high */}
  <div className="relative w-full h-full flex flex-col gap-6 pt-4">
    {videos.map((videoUrl, index) => (
      <div
        key={index}
        className="relative w-full h-screen flex justify-center items-center snap-center"
      >
        <div className="relative w-full flex justify-center">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={videoUrl}
            className="h-[93vh] max-h-[93vh] w-auto max-w-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
            loop
            playsInline
            muted={isMuted}
            onClick={togglePlayPause}
          />

          {/* ✅ Mute/Unmute Button - Now Properly Inside the Video */}
          {currentIndex === index && (
            <button
              className="absolute bottom-5 right-5 bg-black/50 text-white p-3 rounded-full shadow-md hover:bg-black/70 transition"
              onClick={toggleMute}
            >
              {isMuted ? <FaVolumeMute className="text-xl" /> : <FaVolumeUp className="text-xl" />}
            </button>
          )}
        </div>

        {/* ✅ Play Button Overlay - Small & Centered */}
        {isPaused && currentIndex === index && (
          <div
            className="absolute inset-0 flex justify-center items-center"
            onClick={togglePlayPause}
          >
            <div className="w-16 h-16 bg-black/60 rounded-full flex justify-center items-center">
              <FaPlay className="text-white text-3xl" />
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</div>
