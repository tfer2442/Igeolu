import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill, BsStopCircleFill, BsRecordCircleFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { MdFlipCameraIos } from 'react-icons/md';

import './MobileLivePage.css';

function MobileLivePage() {
    const location = useLocation();
    const { sessionId, token, role } = location.state;  // 백엔드에서 받은 token 사용
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const OV = useRef(new OpenVidu());
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [devices, setDevices] = useState([]);
    const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
    const [currentSubscriberIndex, setCurrentSubscriberIndex] = useState(0);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const newSession = OV.current.initSession();
                setSession(newSession);

                newSession.on('streamCreated', (event) => {
                    const subscriber = newSession.subscribe(event.stream, undefined);
                    setSubscribers((subscribers) => [...subscribers, subscriber]);
                });

                newSession.on('streamDestroyed', (event) => {
                    setSubscribers((subscribers) =>
                        subscribers.filter((sub) => sub !== event.stream.streamManager)
                    );
                });

                // 백엔드에서 받은 token을 직접 사용
                await newSession.connect(token);
                console.log('Session connected with token:', token);

                const publisher = await OV.current.initPublisherAsync(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '640x480',
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: false,
                });

                await newSession.publish(publisher);
                setPublisher(publisher);
                console.log('Publisher created:', publisher);

            } catch (error) {
                console.error('Error initializing session:', error.message);
                console.error('Full error:', error);
            }
        };

        const getVideoDevices = async () => {
            const devices = await OV.current.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            setCurrentVideoDevice(videoDevices[0]); // 기본값으로 첫 번째 카메라 설정
        };

        if (token && sessionId) {
            initializeSession();
        }
        getVideoDevices();

        return () => {
            if (session) {
                session.disconnect();
            }
        };
    }, [sessionId, token]);

    const toggleMicrophone = () => {
        if (publisher) {
            publisher.publishAudio(!isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCamera = () => {
        if (publisher) {
            publisher.publishVideo(!isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    const switchCamera = async () => {
        try {
            if (devices.length < 2) return; // 카메라가 1개 이하면 리턴

            // 현재 카메라의 인덱스 찾기
            const currentIndex = devices.findIndex(device => device.deviceId === currentVideoDevice.deviceId);
            // 다음 카메라 선택 (마지막 카메라면 첫 번째 카메라로)
            const nextDevice = devices[(currentIndex + 1) % devices.length];
            
            if (publisher) {
                // 기존 트랙 정지
                publisher.stream.getMediaStream().getTracks().forEach(track => track.stop());
                
                // 새로운 비디오 설정으로 스트림 교체
                await publisher.replaceVideo(nextDevice.deviceId);
                setCurrentVideoDevice(nextDevice);
            }
        } catch (error) {
            console.error('Error switching camera:', error);
        }
    };

    const toggleRecording = () => {
        // TODO: 녹화 API 구현 후 기능 추가 예정
        setIsRecording(!isRecording);
    };

    const leaveSession = () => {
        if (session) {
            session.disconnect();
            window.location.href = '/';
        }
    };

    const handlePrevSubscriber = () => {
        setCurrentSubscriberIndex((prev) => 
            prev === 0 ? subscribers.length - 1 : prev - 1
        );
    };

    const handleNextSubscriber = () => {
        setCurrentSubscriberIndex((prev) => 
            prev === subscribers.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="mobile-live-page-container">
            <div className="mobile-live-page">
                <div className="mobile-live-page__live-cam" id="video-container">
                    <div className="session-code">
                        <p>세션 코드: {sessionId}</p>
                    </div>
                    {publisher && role === 'host' && (
                        <>
                            <video
                                autoPlay
                                ref={(video) => video && publisher.addVideoElement(video)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {devices.length > 1 && (
                                <button 
                                    className="camera-switch-button"
                                    onClick={switchCamera}
                                >
                                    <MdFlipCameraIos size={24} />
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div className="mobile-live-page__right-content">
                    <div className="mobile-live-page__right-content__my-cam">
                        {subscribers.length > 0 && (
                            <>
                                <video
                                    autoPlay
                                    ref={(video) => video && subscribers[currentSubscriberIndex].addVideoElement(video)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {subscribers.length > 1 && (
                                    <>
                                        <button 
                                            className="subscriber-nav-button left"
                                            onClick={handlePrevSubscriber}
                                        >
                                            &#8249;
                                        </button>
                                        <button 
                                            className="subscriber-nav-button right"
                                            onClick={handleNextSubscriber}
                                        >
                                            &#8250;
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="mobile-live-page__right-content__live-list">
                    </div>
                    <div className="mobile-live-page__right-content__live-option">
                        <div className="toolbar">
                            <button onClick={toggleMicrophone} className={isMicOn ? 'active' : ''}>
                                {isMicOn ? <BsMicFill /> : <BsMicMuteFill />}
                            </button>
                            <button onClick={toggleCamera} className={isCameraOn ? 'active' : ''}>
                                {isCameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
                            </button>
                            <button onClick={toggleRecording} className={isRecording ? 'active' : ''}>
                                {isRecording ? <BsStopCircleFill /> : <BsRecordCircleFill />}
                            </button>
                            <button onClick={leaveSession}>
                                <BiExit />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileLivePage;
