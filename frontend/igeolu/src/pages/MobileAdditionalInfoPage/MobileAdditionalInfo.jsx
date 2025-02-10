// src/pages/MobileAdditionalInfoPage/MobileAdditionalInfo.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './MobileAdditionalInfo.css';
import AdditionalInfoAPI from '../../services/AdditionalInfoApi';
import PropTypes from 'prop-types'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '../../components/ui/dialog';

const AddressSearchDialog = ({ 
  isOpen, 
  onOpenChange, 
  keyword, 
  onKeywordChange, 
  onSearch, 
  isSearching, 
  results, 
  onSelect 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
          <DialogDescription>
            도로명 주소나 지번 주소를 입력해주세요
          </DialogDescription>
        </DialogHeader>
        <div className="dialog-body">
          <form onSubmit={onSearch}>
            <div className="search-form-group">
              <input
                type="text"
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                className="search-input"
                placeholder="예: 테헤란로 123 또는 역삼동 123"
              />
              <button
                type="submit"
                className="search-button"
                disabled={isSearching}
              >
                검색
              </button>
            </div>
          </form>
          
          <div className="search-results">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => onSelect(result)}
                className="result-item"
              >
                <p className="result-road">{result.roadAddrPart1}</p>
                <p className="result-jibun">{result.jibunAddr}</p>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const MobileAdditionalInfo = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    registrationNumber: '',
    tel: '',
    address: '',  
    latitude: '',
    longitude: '',
    dongcode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressKeyword, setAddressKeyword] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSearchAddress = () => {
    setIsAddressDialogOpen(true);
  };

  const handleAddressSearch = async (e) => {
    e.preventDefault();
    if (!addressKeyword.trim()) return;

    setIsSearching(true);
    try {
      const response = await AdditionalInfoAPI.searchAddress(addressKeyword);
      if (response.results?.juso) {
        setAddressResults(response.results.juso);
      }
    } catch (error) {
      console.error('주소 검색 실패:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSelect = async (selectedAddress) => {
    try {
      const coordResponse = await AdditionalInfoAPI.getCoordinates({
        admCd: selectedAddress.admCd,
        rnMgtSn: selectedAddress.rnMgtSn,
        udrtYn: selectedAddress.udrtYn,
        buldMnnm: selectedAddress.buldMnnm,
        buldSlno: selectedAddress.buldSlno
      });
  
      if (!coordResponse?.results?.juso?.[0]) {
        throw new Error('좌표 정보를 찾을 수 없습니다.');
      }
  
      const coords = coordResponse.results.juso[0];
  
      setFormData(prev => ({
        ...prev,
        address: selectedAddress.roadAddrPart1,
        latitude: parseFloat(coords.entX),
        longitude: parseFloat(coords.entY),
        dongcode: selectedAddress.admCd
      }));
  
      setIsAddressDialogOpen(false);
      setAddressKeyword('');
      setAddressResults([]);
  
    } catch (error) {
      console.error('주소 좌표 변환 실패:', error);
      alert('주소 좌표 변환에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요';
    if (!formData.content.trim()) newErrors.content = '내용을 입력해주세요';
    if (!formData.registrationNumber.match(/^\d{3}-\d{2}-\d{5}$/)) {
      newErrors.registrationNumber = '올바른 사업자등록번호를 입력해주세요';
    }
    if (!formData.tel.match(/^\d{2,3}-\d{3,4}-\d{4}$/)) {
      newErrors.tel = '올바른 전화번호를 입력해주세요';
    }
    if (!formData.address) newErrors.address = '주소를 입력해주세요';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await AdditionalInfoAPI.submitAdditionalInfo(formData);
        console.log('추가 정보 저장 성공:', response);
        // 성공 후 처리 (예: 메인 페이지로 리다이렉트)
      } catch (error) {
        console.error('추가 정보 저장 실패:', error);
        // 에러 처리 (예: 에러 메시지 표시)
      }
    }
  };


  return (
    <div className="additional-info-container">
      <div className="additional-info-wrapper">
        <h1 className="form-title">추가 정보 입력</h1>

        <form onSubmit={handleSubmit} className="info-form">
          <div className="form-group">
            <label className="form-label">
              제목
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="매물 제목을 입력하세요"
            />
            {errors.title && (
              <p className="error-message">{errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              내용
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="매물 상세 설명을 입력하세요"
            />
            {errors.content && (
              <p className="error-message">{errors.content}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              사업자등록번호
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              className="form-input"
              placeholder="000-00-00000"
            />
            {errors.registrationNumber && (
              <p className="error-message">{errors.registrationNumber}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              전화번호
            </label>
            <input
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleInputChange}
              className="form-input"
              placeholder="010-0000-0000"
            />
            {errors.tel && (
              <p className="error-message">{errors.tel}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              주소
            </label>
            <div className="address-input-group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                placeholder="주소를 검색하세요"
                readOnly
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                className="search-button"
              >
                <Search size={16} />
                검색
              </button>
            </div>
            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
          </div>

          <button type="submit" className="submit-button">
            저장하기
          </button>
        </form>
      </div>
      <AddressSearchDialog 
  isOpen={isAddressDialogOpen}
  onOpenChange={setIsAddressDialogOpen}
  keyword={addressKeyword}
  onKeywordChange={setAddressKeyword}
  onSearch={handleAddressSearch}
  isSearching={isSearching}
  results={addressResults}
  onSelect={handleAddressSelect}
/>
    </div>
  );
};

AddressSearchDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  onKeywordChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    roadAddrPart1: PropTypes.string.isRequired,
    jibunAddr: PropTypes.string.isRequired
  })).isRequired,
  onSelect: PropTypes.func.isRequired
}

export default MobileAdditionalInfo;