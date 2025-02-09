import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill, BsStopCircleFill, BsRecordCircleFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { MdFlipCameraIos } from 'react-icons/md';
import axios from 'axios';

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
    const [liveList, setLiveList] = useState([]);
    const [propertyList, setPropertyList] = useState({});  // liveId를 key로 사용

    useEffect(() => {
        const getVideoDevices = async () => {
            try {
                // 먼저 사용자에게 카메라 권한을 요청
                await navigator.mediaDevices.getUserMedia({ video: true });
                
                // 권한을 받은 후 디바이스 목록을 가져옴
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                console.log('Available video devices:', videoDevices); // 디버깅용
                
                setDevices(videoDevices);
                setCurrentVideoDevice(videoDevices[0]);
            } catch (error) {
                console.error('Error getting video devices:', error);
            }
        };

        const initializeSession = async () => {
            try {
                await getVideoDevices(); // getVideoDevices를 먼저 실행
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

        const fetchLiveList = async () => {
            try {
                const response = await axios.get('/api/lives', {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
                        'userId': '32'
                    }
                });
                console.log('Fetched Live List:', response.data);  // 라이브 목록 로그
                setLiveList(response.data);
                
                // 각 라이브에 대한 매물 정보 가져오기
                response.data.forEach(async (live) => {
                    console.log(`Fetching properties for liveId: ${live.liveId}`);  // 각 liveId 로그
                    const propertyResponse = await axios.get(`/api/lives/${live.liveId}/properties`, {
                        headers: {
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
                            'userId': '32'
                        }
                    });
                    console.log(`Properties for liveId ${live.liveId}:`, propertyResponse.data);  // 매물 정보 로그
                    setPropertyList(prev => ({
                        ...prev,
                        [live.liveId]: propertyResponse.data
                    }));
                });
            } catch (error) {
                console.error('Error fetching live list:', error);
            }
        };

        if (token && sessionId) {
            initializeSession();
            fetchLiveList();
        }

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
            window.location.href = '/mobile-main';
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
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
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
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
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
                        {liveList.map((live) => (
                            <div key={live.liveId} className="live-item">
                                {propertyList[live.liveId]?.map((property, index) => (
                                    <div key={property.propertyId} className="property-item">
                                        <img 
                                            src={property.images[0]} 
                                            alt="Property" 
                                            className="property-image"
                                        />
                                        <div className="property-info">
                                            <p>{property.deposit.toLocaleString()}/{property.monthlyRent.toLocaleString()}</p>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        ))}
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
