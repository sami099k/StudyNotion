import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { markVideoAsCompleted } from '../../services/operations/studentFeautersAPI';
import { setCompletedLectures } from '../../slices/viewCourseSlice';

const PLAYBACK_SPEEDS = [0.5, 1, 1.25, 1.5, 2];

function getNotesKey(courseId, subSectionId) {
  return `notes_${courseId}_${subSectionId}`;
}

const VideoPlayer = () => {
  const { subSectionId, sectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseEntireData, courseSectionData, completedLectures } = useSelector((state) => state.viewCourse);
  const { token } = useSelector((state) => state.auth);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const videoRef = useRef(null);

  // Load notes from localStorage
  useEffect(() => {
    if (courseEntireData?._id && subSectionId) {
      const key = getNotesKey(courseEntireData._id, subSectionId);
      const saved = localStorage.getItem(key);
      setNotes(saved ? JSON.parse(saved) : []);
    }
  }, [courseEntireData?._id, subSectionId]);

  // Save notes to localStorage
  useEffect(() => {
    if (courseEntireData?._id && subSectionId) {
      const key = getNotesKey(courseEntireData._id, subSectionId);
      localStorage.setItem(key, JSON.stringify(notes));
    }
  }, [notes, courseEntireData?._id, subSectionId]);

  useEffect(() => {
    if (courseSectionData && subSectionId && subSectionId !== 'no-content') {
      let foundSubSection = null;
      for (const section of courseSectionData) {
        const subSection = section.subSection?.find(sub => sub._id === subSectionId);
        if (subSection) {
          foundSubSection = subSection;
          break;
        }
      }
      setCurrentVideo(foundSubSection);
      setLoading(false);
    } else if (subSectionId === 'no-content') {
      setCurrentVideo(null);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [courseSectionData, subSectionId]);

  // Set playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Resume from last watched time
  useEffect(() => {
    if (videoRef.current && courseEntireData?._id && subSectionId) {
      const key = `progress_${courseEntireData._id}_${subSectionId}`;
      const lastTime = localStorage.getItem(key);
      if (lastTime) {
        videoRef.current.currentTime = parseFloat(lastTime);
      }
    }
  }, [currentVideo, courseEntireData?._id, subSectionId]);

  // Save progress on time update
  const handleTimeUpdate = () => {
    if (videoRef.current && courseEntireData?._id && subSectionId) {
      const key = `progress_${courseEntireData._id}_${subSectionId}`;
      localStorage.setItem(key, videoRef.current.currentTime);
    }
  };

  // Picture-in-picture
  const handlePiP = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (e) {
        alert('Picture-in-Picture not supported in this browser.');
      }
    }
  };

  // Find next video
  const getNextVideo = () => {
    if (!courseSectionData || !currentVideo) return null;
    let found = false;
    for (let i = 0; i < courseSectionData.length; i++) {
      const section = courseSectionData[i];
      for (let j = 0; j < section.subSection.length; j++) {
        const sub = section.subSection[j];
        if (sub._id === currentVideo._id) {
          // Next in this section
          if (j + 1 < section.subSection.length) {
            return {
              sectionId: section._id,
              subSectionId: section.subSection[j + 1]._id,
            };
          }
          // First in next section
          if (i + 1 < courseSectionData.length && courseSectionData[i + 1].subSection.length > 0) {
            return {
              sectionId: courseSectionData[i + 1]._id,
              subSectionId: courseSectionData[i + 1].subSection[0]._id,
            };
          }
        }
      }
    }
    return null;
  };

  // Find previous video
  const getPrevVideo = () => {
    if (!courseSectionData || !currentVideo) return null;
    for (let i = 0; i < courseSectionData.length; i++) {
      const section = courseSectionData[i];
      for (let j = 0; j < section.subSection.length; j++) {
        const sub = section.subSection[j];
        if (sub._id === currentVideo._id) {
          // Previous in this section
          if (j - 1 >= 0) {
            return {
              sectionId: section._id,
              subSectionId: section.subSection[j - 1]._id,
            };
          }
          // Last in previous section
          if (i - 1 >= 0 && courseSectionData[i - 1].subSection.length > 0) {
            const prevSection = courseSectionData[i - 1];
            return {
              sectionId: prevSection._id,
              subSectionId: prevSection.subSection[prevSection.subSection.length - 1]._id,
            };
          }
        }
      }
    }
    return null;
  };

  // Auto-next on video end
  const handleVideoEnded = async () => {
    if (currentVideo && !completedLectures.includes(currentVideo._id)) {
      try {
        const result = await markVideoAsCompleted(token, courseEntireData._id, currentVideo._id);
        if (result?.success) {
          dispatch(setCompletedLectures([...completedLectures, currentVideo._id]));
        }
      } catch (error) {
        console.error('Error marking video as completed:', error);
      }
    }
    // Auto-next
    const next = getNextVideo();
    if (next) {
      navigate(`/view-course/${courseEntireData._id}/section/${next.sectionId}/sub-section/${next.subSectionId}`);
    }
  };

  // Add note
  const handleAddNote = () => {
    if (!noteInput.trim() || !videoRef.current) return;
    const newNote = {
      time: videoRef.current.currentTime,
      text: noteInput.trim(),
      id: Date.now(),
    };
    setNotes([...notes, newNote]);
    setNoteInput("");
  };

  // Jump to note time
  const handleJumpToNote = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.focus();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col bg-[#000814] p-8">
        <div className="relative w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-[#2C333F]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD60A] mx-auto mb-4"></div>
            <p className="text-[#F1F2F3] text-sm font-medium">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="flex flex-1 flex-col bg-[#000814] p-8">
        <div className="relative w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-[#2C333F]">
          <div className="text-center text-[#F1F2F3] p-8 max-w-md">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#2C333F] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[#EF476F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#F1F2F3]">Video Not Found</h2>
            <p className="text-[#999DAA] mb-6 leading-relaxed">The selected video could not be loaded.</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2C333F] mb-6">
              <p className="text-sm text-[#FFD60A] mb-3 font-medium">Possible reasons:</p>
              <ul className="text-xs text-[#999DAA] space-y-2">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-[#EF476F] rounded-full mr-2"></span>
                  The course has no content yet
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-[#EF476F] rounded-full mr-2"></span>
                  The video URL is not available
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-[#EF476F] rounded-full mr-2"></span>
                  There's an issue with the course structure
                </li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/dashboard/enrolled-courses')}
              className="group relative px-6 py-3 bg-[#FFD60A] text-[#000000] rounded-lg font-semibold hover:bg-[#FFC800] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Enrolled Courses
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#000814]">
      {/* Video Player Container */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-[#2C333F]">
        {currentVideo.videoURL ? (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4">
              {/* Playback Speed */}
              <div className="flex items-center gap-2">
                <label htmlFor="playbackRate" className="text-xs text-[#999DAA]">Speed:</label>
                <select
                  id="playbackRate"
                  value={playbackRate}
                  onChange={e => setPlaybackRate(Number(e.target.value))}
                  className="rounded bg-[#2C333F] text-[#FFD60A] px-2 py-1 text-xs border border-[#FFD60A] focus:outline-none"
                >
                  {PLAYBACK_SPEEDS.map(speed => (
                    <option key={speed} value={speed}>{speed}x</option>
                  ))}
                </select>
              </div>
              {/* PiP Button */}
              <button
                onClick={handlePiP}
                className="rounded bg-[#FFD60A] text-[#000814] px-3 py-1 text-xs font-semibold shadow hover:bg-[#FFC800] transition"
                title="Picture-in-Picture"
              >
                PiP
              </button>
            </div>
            <video
              ref={videoRef}
              controls
              className="w-full h-full object-contain rounded-xl mt-2"
              poster={courseEntireData?.thumbnail}
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
              style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
            >
              <source src={currentVideo.videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="text-center text-[#F1F2F3] p-8 max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#2C333F] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FFD60A]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-[#F1F2F3]">{currentVideo.title}</h2>
            <p className="text-[#999DAA] mb-6 leading-relaxed">{currentVideo.description}</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2C333F]">
              <p className="text-sm text-[#FFD60A] mb-3 font-medium">Video not available</p>
              <p className="text-xs text-[#999DAA] mb-2">This lecture might be:</p>
              <ul className="text-xs text-[#999DAA] space-y-1">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-[#FFD60A] rounded-full mr-2"></span>
                  A text-based lecture
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-[#FFD60A] rounded-full mr-2"></span>
                  Still being uploaded
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-[#FFD60A] rounded-full mr-2"></span>
                  Available in a different format
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Video Information Card */}
      <div className="mt-8 p-6 bg-[#161D29] rounded-xl border border-[#2C333F] shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#F1F2F3] mb-3 leading-tight">{currentVideo.title}</h1>
            {currentVideo.description && (
              <p className="text-[#999DAA] mb-4 leading-relaxed text-sm">{currentVideo.description}</p>
            )}
          </div>
          {currentVideo.timeDuration && (
            <div className="flex items-center bg-[#2C333F] px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-[#FFD60A] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-[#F1F2F3] font-medium">{currentVideo.timeDuration}</span>
            </div>
          )}
        </div>
        {/* Video Status */}
        <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-[#2C333F]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${currentVideo.videoURL ? 'bg-[#06D6A0]' : 'bg-[#EF476F]'}`}></div>
              <span className="text-xs text-[#999DAA]">
                {currentVideo.videoURL ? 'Video Available' : 'Video Not Available'}
              </span>
            </div>
            <div className="text-xs text-[#999DAA]">
              ID: {currentVideo._id?.slice(-8) || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Notes/Bookmarks Section */}
      <div className="mt-6 p-6 bg-[#161D29] rounded-xl border border-[#2C333F] shadow-lg">
        <h2 className="text-lg font-semibold text-[#FFD60A] mb-3">Notes & Bookmarks</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            placeholder="Add a note at current time..."
            className="flex-1 rounded bg-[#2C333F] text-[#F1F2F3] px-3 py-2 text-sm border border-[#FFD60A] focus:outline-none"
            onKeyDown={e => { if (e.key === 'Enter') handleAddNote(); }}
          />
          <button
            onClick={handleAddNote}
            className="rounded bg-[#FFD60A] text-[#000814] px-4 py-2 text-sm font-semibold shadow hover:bg-[#FFC800] transition"
          >
            Add Note
          </button>
        </div>
        {notes.length === 0 ? (
          <p className="text-[#999DAA] text-sm">No notes yet for this video.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map(note => (
              <li key={note.id} className="flex items-center gap-3 bg-[#23293a] rounded p-2">
                <button
                  onClick={() => handleJumpToNote(note.time)}
                  className="text-[#FFD60A] underline text-xs font-mono mr-2"
                  title={`Jump to ${Math.floor(note.time/60)}:${('0'+Math.floor(note.time%60)).slice(-2)}`}
                >
                  {Math.floor(note.time/60)}:{('0'+Math.floor(note.time%60)).slice(-2)}
                </button>
                <span className="text-[#F1F2F3] text-xs flex-1">{note.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="group relative px-6 py-3 bg-[#2C333F] text-[#F1F2F3] rounded-lg font-semibold hover:bg-[#FFD60A] hover:text-[#000000] transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => {
            const prev = getPrevVideo();
            if (prev) {
              navigate(`/view-course/${courseEntireData._id}/section/${prev.sectionId}/sub-section/${prev.subSectionId}`);
            }
          }}
          disabled={!getPrevVideo()}
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </span>
        </button>
        <button
          className="group relative px-6 py-3 bg-[#FFD60A] text-[#000000] rounded-lg font-semibold hover:bg-[#FFC800] transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => {
            const next = getNextVideo();
            if (next) {
              navigate(`/view-course/${courseEntireData._id}/section/${next.sectionId}/sub-section/${next.subSectionId}`);
            }
          }}
          disabled={!getNextVideo()}
        >
          <span className="flex items-center">
            Next
            <svg className="w-4 h-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer; 