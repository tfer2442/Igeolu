// src/pages/MobileEditPage/MobileEditPage.js
import { useState, useRef, useEffect } from 'react';
import { IoIosArrowBack, IoIosCamera, IoMdClose } from 'react-icons/io';
import './MobileEditPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdditionalInfoAPI from '../../services/AdditionalInfoApi';

// axios 기본 설정
axios.defaults.withCredentials = true;

function MobileEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const propertyData = location.state?.propertyData;
  console.log('전달받은 매물 데이터:', propertyData); // 디버깅용 로그

  const [images, setImages] = useState(propertyData?.images || []);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]); // 삭제된 이미지 추적을 위해 추가
  const fileInputRef = useRef(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionsList, setOptionsList] = useState([]);
  const [addressKeyword, setAddressKeyword] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [coordinates, setCoordinates] = useState({
    x: '',
    y: '',
    dongcode: '',
  });
  const [address, setAddress] = useState(propertyData?.address || '');
  const [description, setDescription] = useState(
    propertyData?.description || ''
  );
  const [deposit, setDeposit] = useState(propertyData?.deposit || '');
  const [monthlyRent, setMonthlyRent] = useState(
    propertyData?.monthlyRent || ''
  );
  const [area, setArea] = useState(propertyData?.area || '');
  const [approvalDate, setApprovalDate] = useState(
    propertyData?.approvalDate || ''
  );
  const [currentFloor, setCurrentFloor] = useState(
    propertyData?.currentFloor || ''
  );
  const [totalFloors, setTotalFloors] = useState(
    propertyData?.totalFloors || ''
  );

  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };

  const toggleOption = (option) => {
    if (selectedOptions.some((opt) => opt.optionId === option.optionId)) {
      setSelectedOptions(
        selectedOptions.filter((opt) => opt.optionId !== option.optionId)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files]); // 새 파일들 저장
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
  };

  const handleDeleteImage = (indexToDelete) => {
    const deletedImage = images[indexToDelete];
    
    // 기존 이미지 URL인 경우에만 deletedImages에 추가
    if (propertyData?.images?.includes(deletedImage)) {
      setDeletedImages(prev => [...prev, deletedImage]);
    }
    
    // 새로 추가된 이미지인 경우 newImageFiles에서도 제거
    setNewImageFiles(prev => prev.filter((_, idx) => idx !== indexToDelete));
    setImages(images.filter((_, index) => index !== indexToDelete));
  };

  const searchAddress = async () => {
    if (!addressKeyword.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await AdditionalInfoAPI.searchAddress(addressKeyword);

      if (response.results?.common?.errorCode === '0') {
        setAddressResults(response.results.juso || []);
        setShowResults(true);
      } else {
        throw new Error(
          response.results?.common?.errorMessage || '주소 검색에 실패했습니다.'
        );
      }
    } catch (err) {
      setSearchError(err.message);
      setAddressResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getCoordinates = async (admCd, rnMgtSn, udrtYn, buldMnnm, buldSlno) => {
    try {
      const response = await AdditionalInfoAPI.getCoordinates({
        admCd,
        rnMgtSn,
        udrtYn,
        buldMnnm,
        buldSlno,
      });

      if (response.results?.common?.errorCode === '0') {
        const coordInfo = response.results.juso[0];
        return {
          entX: coordInfo.entX,
          entY: coordInfo.entY,
        };
      }
      throw new Error('좌표를 찾을 수 없습니다.');
    } catch (error) {
      console.error('좌표 변환 실패:', error);
      return null;
    }
  };

  const handleAddressSelect = async (result) => {
    try {
      const coords = await getCoordinates(
        result.admCd,
        result.rnMgtSn,
        result.udrtYn,
        result.buldMnnm,
        result.buldSlno
      );

      setAddress(result.roadAddr);
      setCoordinates({
        x: coords?.entX || propertyData.longitude || 0,
        y: coords?.entY || propertyData.latitude || 0,
        dongcode: result.admCd,
      });

      setShowResults(false);
      setAddressKeyword('');
    } catch (error) {
      console.error('주소 선택 처리 실패:', error);
      setCoordinates({
        x: propertyData.longitude || 0,
        y: propertyData.latitude || 0,
        dongcode: result.admCd,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // 데이터 유효성 검사 추가
      if (
        !description ||
        !deposit ||
        !monthlyRent ||
        !area ||
        !approvalDate ||
        !currentFloor ||
        !totalFloors ||
        !address
      ) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }

      // 현재 표시된 이미지 중 기존 이미지 URL만 필터링
      const remainingOriginalImages = images.filter(img => 
        propertyData?.images?.includes(img)
      );

      const updateData = {
        propertyId: propertyData.propertyId,
        userId: propertyData.userId,
        description: description,
        deposit: parseInt(deposit),
        monthlyRent: parseInt(monthlyRent),
        area: parseFloat(area),
        approvalDate: approvalDate,
        currentFloor: parseInt(currentFloor),
        totalFloors: parseInt(totalFloors),
        address: address,
        y: coordinates.y,
        x: coordinates.x,
        dongcode: coordinates.dongcode,
        options: selectedOptions.map((opt) => opt.optionId),
        imageUrls: remainingOriginalImages, // 삭제되지 않은 기존 이미지 URL들만 포함
      };

      // 데이터 확인용 로그
      console.log('전송할 데이터:', updateData);

      // FormData 생성
      const formData = new FormData();

      // JSON 데이터를 Blob 형태로 추가
      formData.append(
        'requestDto',
        new Blob([JSON.stringify(updateData)], { type: 'application/json' })
      );

      // 새로 추가된 이미지 파일들만 FormData에 추가
      newImageFiles.forEach((file) => {
        formData.append('images', file);
      });

      // FormData 내용 확인
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // const response = await axios.put(
      //   `/api/properties/${propertyData.propertyId}`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       Authorization:
      //         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
      //     },
      //   }
      // );

      const response = await axios.put(
        `/api/properties/${propertyData.propertyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('매물 정보가 성공적으로 수정되었습니다.');
        navigate(-1);
      }
    } catch (error) {
      console.error('매물 수정 실패:', error);
      console.error('에러 응답:', error.response?.data); // 서버 에러 메시지 확인
      alert(`매물 수정에 실패했습니다. ${error.response?.data?.message || ''}`);
    }
  };

  // const handleDelete = async () => {
  //   if (window.confirm('정말로 이 매물을 삭제하시겠습니까?')) {
  //     try {
  //       console.log('삭제 시도:', propertyData.propertyId); // 디버깅 로그

  //       const response = await axios.delete(
  //         `/api/properties/${propertyData.propertyId}`,
  //         {
  //           headers: {
  //             Authorization:
  //               'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
  //           },
  //         }
  //       );

  //       console.log('삭제 응답:', response); // 디버깅 로그

  //       if (response.status === 204) {
  //         alert('매물이 성공적으로 삭제되었습니다.');
  //         console.log('네비게이션 시도'); // 디버깅 로그
  //         navigate('/mobile-estate-list', { replace: true });
  //         console.log('네비게이션 완료'); // 디버깅 로그
  //       }
  //     } catch (error) {
  //       console.error('매물 삭제 실패:', error);
  //       console.error('에러 응답:', error.response?.data); // 상세 에러 정보
  //       alert(
  //         `매물 삭제에 실패했습니다. ${error.response?.data?.message || ''}`
  //       );
  //     }
  //   }
  // };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(
          `/api/properties/${propertyData.propertyId}`
        );

        if (response.status === 204) {
          alert('매물이 성공적으로 삭제되었습니다.');
          navigate('/mobile-estate-list', { replace: true });
        }
      } catch (error) {
        console.error('매물 삭제 실패:', error);
        console.error('에러 응답:', error.response?.data);
        alert(
          `매물 삭제에 실패했습니다. ${error.response?.data?.message || ''}`
        );
      }
    }
  };

  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const response = await axios.get('/api/options', {
  //         headers: {
  //           Authorization:
  //             'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
  //         },
  //       });
  //       console.log('옵션 목록 응답:', response.data);
  //       setOptionsList(response.data);

  //       if (propertyData && propertyData.options) {
  //         console.log('설정할 옵션:', propertyData.options);
  //         setSelectedOptions(propertyData.options);
  //       }
  //     } catch (error) {
  //       console.error('옵션 목록을 불러오는데 실패했습니다:', error);
  //     }
  //   };

  //   fetchOptions();
  // }, [propertyData]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('/api/options');
        console.log('옵션 목록 응답:', response.data);
        setOptionsList(response.data);

        if (propertyData && propertyData.options) {
          console.log('설정할 옵션:', propertyData.options);
          setSelectedOptions(propertyData.options);
        }
      } catch (error) {
        console.error('옵션 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchOptions();
  }, [propertyData]);

  useEffect(() => {
    if (propertyData) {
      setImages(propertyData.images || []);
      setDescription(propertyData.description || '');
      setDeposit(propertyData.deposit || '');
      setMonthlyRent(propertyData.monthlyRent || '');
      setArea(propertyData.area || '');
      setApprovalDate(propertyData.approvalDate || '');
      setCurrentFloor(propertyData.currentFloor || '');
      setTotalFloors(propertyData.totalFloors || '');
      setAddress(propertyData.address || '');
      setCoordinates({
        x: propertyData.longitude || '',
        y: propertyData.latitude || '',
        dongcode: propertyData.dongcode || '',
      });
    }
  }, [propertyData]);

  return (
    <div className='mobile-edit-page-container'>
      <div className='mobile-edit-page'>
        <div className='mobile-edit-page__top-bar'>
          <IoIosArrowBack
            className='back-button'
            onClick={() => window.history.back()}
            size={24}
          />
        </div>
        <p className='mobile-edit-page__title'>매물 수정</p>
        <div className='mobile-edit-page__introduce'>
          <label>매물 소개</label>
          <input
            placeholder='매물 소개를 입력해 주세요.'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></input>
        </div>
        <div className='mobile-edit-page__photo'>
          <div className='photo-header'>
            <label>사진 첨부</label>
            <IoIosCamera
              className='camera-icon'
              size={40}
              onClick={() => fileInputRef.current.click()}
            />
          </div>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          {images.length > 0 ? (
            <div className='image-preview-container'>
              <div className='image-preview-scroll'>
                {images.map((url, index) => (
                  <div key={index} className='image-preview'>
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <div
                      className='delete-button'
                      onClick={() => handleDeleteImage(index)}
                    >
                      <IoMdClose size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='no-image-message'>사진을 첨부해주세요.</div>
          )}
        </div>
        <div className='mobile-edit-page__deposit-rent'>
          <label>보증금 / 월세</label>
          <div className='deposit-input'>
            <input
              placeholder='보증금'
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            ></input>
            <input
              placeholder='월세'
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
            ></input>
          </div>
        </div>
        <div className='mobile-edit-page__area'>
          <label>면적</label>
          <input
            placeholder='00m²'
            value={area}
            onChange={(e) => setArea(e.target.value)}
          ></input>
        </div>
        <div className='mobile-edit-page__approve'>
          <label>사용승인일</label>
          <input
            type='date'
            placeholder='YYYY-MM-DD'
            value={approvalDate}
            onChange={(e) => setApprovalDate(e.target.value)}
          />
        </div>
        <div className='mobile-edit-page__floor'>
          <label>해당층 / 총층</label>
          <div className='floor-input'>
            <input
              placeholder='해당층'
              value={currentFloor}
              onChange={(e) => setCurrentFloor(e.target.value)}
            ></input>
            <input
              placeholder='총층'
              value={totalFloors}
              onChange={(e) => setTotalFloors(e.target.value)}
            ></input>
          </div>
        </div>
        <div className='mobile-edit-page__address'>
          <label>주소</label>
          <div className='address-search-container'>
            <input
              placeholder='주소를 검색해 주세요.'
              value={addressKeyword}
              onChange={(e) => setAddressKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <button onClick={searchAddress} disabled={isSearching}>
              {isSearching ? '검색중...' : '검색'}
            </button>
          </div>

          {searchError && <div className='error-message'>{searchError}</div>}

          {showResults && addressResults.length > 0 && (
            <div className='address-results'>
              {addressResults.map((result, index) => (
                <div
                  key={index}
                  className='address-item'
                  onClick={() => handleAddressSelect(result)}
                >
                  <p className='road-address'>{result.roadAddr}</p>
                  <p className='jibun-address'>[지번] {result.jibunAddr}</p>
                </div>
              ))}
            </div>
          )}

          {!isSearching &&
            !searchError &&
            addressResults.length === 0 &&
            addressKeyword && (
              <div className='no-results' style={{ color: 'white' }}>
                검색 결과가 없습니다.
              </div>
            )}

          {address && (
            <div className='selected-address'>선택된 주소: {address}</div>
          )}
        </div>
        <div className="mobile-edit-page__option">
            <div className="mobile-edit-page__option-label">
                <span>옵션</span>
            </div>
            <div className="mobile-edit-page__options-container">
                {optionsList.map((option) => (
                    <span
                        key={option.optionId}
                        className={`mobile-edit-page__option-item ${
                            selectedOptions.some((opt) => opt.optionId === option.optionId) 
                            ? 'mobile-edit-page__option-item--selected' 
                            : ''
                        }`}
                        onClick={() => toggleOption(option)}
                    >
                        {option.optionName}
                    </span>
                ))}
            </div>
        </div>
   
        <div className='button-container'>
          <input
            type='submit'
            value='수정'
            className='edit-button'
            onClick={handleUpdate}
          />
          <input
            type='submit'
            value='거래 완료'
            className='complete-button'
            onClick={handleDelete}
          />
        </div>
        <MobileBottomTab />
      </div>
    </div>
  );
}

export default MobileEditPage;
