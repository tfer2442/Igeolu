import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill, BsStopCircleFill, BsRecordCircleFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { MdFlipCameraIos, MdNavigateNext } from 'react-icons/md';
import axios from 'axios';

import './MobileLivePage.css';

// axios 기본 설정
axios.defaults.withCredentials = true;

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
    const [currentSubscriberIndex, setCurrentSubscriberIndex] = useState(0);
    const [liveList, setLiveList] = useState([]);
    const [propertyList, setPropertyList] = useState({});  // liveId를 key로 사용
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
    const [currentLivePropertyId, setCurrentLivePropertyId] = useState(null);
    const [recordingId, setRecordingId] = useState(null);
    const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
    const [watchId, setWatchId] = useState(null);

    useEffect(() => {
        const getVideoDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                
                console.log('All video devices:', videoDevices);
                
                // 먼저 일반적인 키워드로 시도
                let frontCamera = videoDevices.find(device => 
                    device.label.toLowerCase().includes('front') ||
                    device.label.toLowerCase().includes('전면') ||
                    device.label.toLowerCase().includes('user')
                );
                let backCamera = videoDevices.find(device => 
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('후면') ||
                    device.label.toLowerCase().includes('environment')
                );

                // 키워드로 찾지 못한 경우, facingMode 제약 조건을 사용하여 재시도
                if (!frontCamera || !backCamera) {
                    try {
                        const frontStream = await navigator.mediaDevices.getUserMedia({
                            video: { facingMode: 'user' }
                        });
                        const frontTrack = frontStream.getVideoTracks()[0];
                        frontCamera = videoDevices.find(device => device.deviceId === frontTrack.getSettings().deviceId);
                        frontTrack.stop();

                        const backStream = await navigator.mediaDevices.getUserMedia({
                            video: { facingMode: 'environment' }
                        });
                        const backTrack = backStream.getVideoTracks()[0];
                        backCamera = videoDevices.find(device => device.deviceId === backTrack.getSettings().deviceId);
                        backTrack.stop();
                    } catch (e) {
                        console.log('Error trying to identify cameras by facingMode:', e);
                    }
                }

                // 여전히 찾지 못한 경우, 첫 번째 카메라를 후면 카메라로 가정
                if (!backCamera && videoDevices.length > 0) {
                    backCamera = videoDevices[0];
                }
                if (!frontCamera && videoDevices.length > 1) {
                    frontCamera = videoDevices[1];
                } else if (!frontCamera && videoDevices.length === 1) {
                    frontCamera = videoDevices[0];
                }
                
                console.log('Available cameras:');
                console.log('Front camera:', frontCamera);
                console.log('Back camera:', backCamera);
                console.log('Current role:', role);
                console.log('Selected camera:', role === 'host' ? 'Back camera' : 'Front camera');
                
                setDevices(videoDevices);
                if (role === 'host') {
                    setCurrentVideoDevice(backCamera || videoDevices[0]);
                } else {
                    setCurrentVideoDevice(frontCamera || videoDevices[0]);
                }
            } catch (error) {
                console.error('Error getting video devices:', error);
            }
        };

        // getVideoDevices 함수 호출 추가
        getVideoDevices();

        const initializeSession = async () => {
            try {
                OV.current = new OpenVidu();
                const newSession = OV.current.initSession();
                
                newSession.on('streamCreated', (event) => {
                    console.log('Stream Created - Connection Data:', event.stream.connection.data);
                    console.log('Stream Connection Details:', {
                        connectionId: event.stream.connection.connectionId,
                        creationTime: event.stream.connection.creationTime,
                        data: event.stream.connection.data
                    });
                    const subscriber = newSession.subscribe(event.stream, undefined);
                    setSubscribers((subscribers) => [...subscribers, subscriber]);
                });

                newSession.on('connectionCreated', (event) => {
                    console.log('Connection Created:', {
                        connectionId: event.connection.connectionId,
                        role: role,
                        data: event.connection.data
                    });
                });

                // role 정보를 포함한 clientData 생성
                const clientData = JSON.stringify({ role: role });
                console.log('Connecting with clientData:', clientData);

                try {
                    // clientData를 포함하여 연결
                    await newSession.connect(token, clientData);
                    console.log('Session connected successfully');
                    console.log('My Connection Data:', newSession.connection.data);
                    setSession(newSession);

                    const publisher = await OV.current.initPublisherAsync(undefined, {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: true,
                        publishVideo: true,
                        resolution: '640x480',
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: true,
                    });

                    await newSession.publish(publisher);
                    console.log('Publisher created with connection data:', publisher.stream.connection.data);
                    setPublisher(publisher);

                } catch (connectionError) {
                    console.error('Connection error:', connectionError);
                    // 연결 실패 시 세션 정리
                    if (newSession) {
                        try {
                            await newSession.disconnect();
                        } catch (e) {
                            console.error('Error disconnecting session:', e);
                        }
                    }
                    throw connectionError;
                }

            } catch (error) {
                console.error('Error initializing session:', error.message);
                console.error('Full error:', error);
               
            }
        };

        const fetchLiveList = async () => {
            try {
<<<<<<< HEAD
                // const propertyResponse = await axios.get(`/api/lives/${sessionId}/properties`, {
                //     headers: {
                //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
                //         'userId': '32'
                //     }
                // });

                const propertyResponse = await axios.get(`/api/lives/${sessionId}/properties`);
                
                
=======
                const propertyResponse = await axios.get(`/api/lives/${sessionId}/properties`, {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
                        'userId': '32'
                    }
                });
                // const propertyResponse = await axios.get(`/api/lives/${sessionId}/properties`);
>>>>>>> reborn
                setLiveList([{ liveId: sessionId }]);
                
                const properties = propertyResponse.data.sort((a, b) => a.livePropertyId - b.livePropertyId);
                console.log('Sorted properties:', properties);
                
                setPropertyList({
                    [sessionId]: properties
                });

                if (properties && Array.isArray(properties) && properties.length > 0) {
                    const initialProperty = properties[0];
                    console.log('Setting initial property:', initialProperty);
                    setCurrentLivePropertyId(initialProperty.livePropertyId);
                    console.log('Initial livePropertyId:', initialProperty.livePropertyId);
                } else {
                    console.log('No properties found in response');
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        if (token && sessionId) {
            initializeSession();
            fetchLiveList();
        }

        return () => {
            if (session) {
                try {
                    session.disconnect();
                } catch (error) {
                    console.error('Error during cleanup:', error);
                }
            }
        };
    }, [sessionId, token, role]);

    useEffect(() => {
        // 세션이 연결되어 있고 호스트인 경우에만 위치 추적 시작
        if (session && role === 'host') {
            const locationWatchId = navigator.geolocation.watchPosition(
                async (position) => {
                    try {
                        const locationData = {
                            type: 'host-location',
                            location: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                            },
                            timestamp: new Date().toISOString()
                        };

                        await session.signal({
                            data: JSON.stringify(locationData),
                            type: 'location-update'
                        });
                    } catch (error) {
                        console.error('Error sending location signal:', error);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 4000 // 3초 이전의 캐시된 위치까지만 사용
                }
            );

            setWatchId(locationWatchId);

            // cleanup function
            return () => {
                if (locationWatchId) {
                    navigator.geolocation.clearWatch(locationWatchId);
                }
            };
        }
    }, [session, role]); // session과 role이 변경될 때만 실행

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
            if (devices.length < 2) return;

            const currentDevice = currentVideoDevice;
            let nextDevice;

            const isCurrentFront = currentDevice.label.toLowerCase().includes('front') ||
                                 currentDevice.label.toLowerCase().includes('전면') ||
                                 currentDevice.label.toLowerCase().includes('user');

            if (isCurrentFront) {
                nextDevice = devices.find(device => 
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('후면') ||
                    device.label.toLowerCase().includes('environment')
                );
            } else {
                nextDevice = devices.find(device => 
                    device.label.toLowerCase().includes('front') ||
                    device.label.toLowerCase().includes('전면') ||
                    device.label.toLowerCase().includes('user')
                );
            }

            if (!nextDevice) {
                const currentIndex = devices.findIndex(device => device.deviceId === currentDevice.deviceId);
                nextDevice = devices[(currentIndex + 1) % devices.length];
            }

            if (publisher) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: nextDevice.deviceId } }
                });
                const videoTrack = stream.getVideoTracks()[0];
                
                await publisher.replaceTrack(videoTrack);
                setCurrentVideoDevice(nextDevice);
            }
        } catch (error) {
            console.error('Error switching camera:', error);
        }
    };

    const toggleRecording = async () => {
        try {
            if (!isRecording) {
                if (currentLivePropertyId) {
                    console.log('Starting recording for property:', currentLivePropertyId);
                    console.log('Session ID:', sessionId);
                    
                    // const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/start`, {
                    //     sessionId: sessionId
                    // }, {
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
                    //     }
                    // });

                    const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/start`, {
                        sessionId: sessionId
                    });
                    // const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/start`, {
                    //     sessionId: sessionId
                    // });
                    
                    if (response.data && response.data.id) {
                        console.log('Recording started successfully. Full response:', response.data);
                        console.log('Recording ID:', response.data.id);
                        setRecordingId(response.data.id);
                    } else {
                        console.error('Recording start failed - Invalid response format:', response.data);
                        throw new Error('녹화 시작 응답이 올바르지 않습니다.');
                    }
                } else {
                    console.error('No property selected for recording');
                    throw new Error('현재 선택된 매물이 없습니다.');
                }
            } else {
                if (!recordingId) {
                    console.error('No recording ID found for stopping recording');
                    throw new Error('녹화 ID를 찾을 수 없습니다.');
                }

                console.log('Stopping recording:', {
                    sessionId: sessionId,
                    recordingId: recordingId,
                    livePropertyId: currentLivePropertyId
                });
                
                // const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/stop`, {
                //     sessionId: sessionId,
                //     recordingId: recordingId,
                //     livePropertyId: currentLivePropertyId
                // }, {
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
                //     }
                // });

                const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/stop`, {
                    sessionId: sessionId,
                    recordingId: recordingId,
                    livePropertyId: currentLivePropertyId
                });
                // const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/stop`, {
                //     sessionId: sessionId,
                //     recordingId: recordingId,
                //     livePropertyId: currentLivePropertyId
                // });
                
                console.log('Recording stopped successfully. Response:', response.data);
                setRecordingId(null);
            }
            setIsRecording(!isRecording);
            console.log('Recording state updated:', !isRecording);
        } catch (error) {
            console.error('Error in toggleRecording:', error);
            console.error('API Error Response:', error.response?.data);
            alert(error.message || '녹화 기능 실행 중 오류가 발생했습니다.');
        }
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

    const handleNextProperty = async (liveId) => {
        const properties = propertyList[liveId]?.sort((a, b) => a.livePropertyId - b.livePropertyId) || [];
        
        try {
            const currentProperty = properties[currentPropertyIndex];
            
            const signalData = {
                propertyId: currentProperty.livePropertyId,
                completedAt: new Date().toISOString()
            };
            
            await session.signal({
                data: JSON.stringify(signalData),
                type: 'property-completed'
            });
            
            if (currentPropertyIndex < properties.length - 1) {
                const nextIndex = currentPropertyIndex + 1;
                setCurrentLivePropertyId(properties[nextIndex].livePropertyId);
                setCurrentPropertyIndex(nextIndex);
            }
        } catch (error) {
            console.error('Error in handleNextProperty:', error);
        }
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
                        {liveList.map((live) => {
                            const sortedProperties = propertyList[live.liveId]
                                ?.sort((a, b) => a.livePropertyId - b.livePropertyId) || [];
                            const currentProperty = sortedProperties[currentPropertyIndex];
                            const isLastProperty = currentPropertyIndex === sortedProperties.length - 1;

                            return (
                                <div key={live.liveId} className="live-item">
                                    {sortedProperties.length > 0 && (
                                        <>
                                            <div className="property-item">
                                                <img 
                                                    src={currentProperty.images[0]} 
                                                    alt="Property" 
                                                    className="property-image"
                                                />
                                                <div className="property-info">
                                                    <p className="price">
                                                        {(currentProperty.deposit ?? 0).toLocaleString()}/
                                                        {(currentProperty.monthlyRent ?? 0).toLocaleString()}
                                                    </p>
                                                    <p className="description">
                                                        {currentProperty.description || "매물 설명이 없습니다."}
                                                    </p>
                                                </div>
                                            </div>
                                            {isLastProperty ? (
                                                <button 
                                                    className="property-nav-button completed"
                                                    onClick={() => handleNextProperty(live.liveId)}
                                                >
                                                    완료
                                                </button>
                                            ) : (
                                                <button 
                                                    className="property-nav-button"
                                                    onClick={() => handleNextProperty(live.liveId)}
                                                >
                                                    <MdNavigateNext size={20} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
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
