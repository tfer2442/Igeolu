import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import './MobileMyPageEdit.css';
import AdditionalInfoAPI from '../../services/AdditionalInfoApi';
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
};

function MobileMyPageEdit() {
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    console.error('user 정보가 없습니다.');
                    alert('로그인이 필요합니다.');
                    navigate('/mobile-login');
                    return;
                }

                const user = JSON.parse(userStr);
                if (!user.userId) {
                    console.error('userId가 없습니다.');
                    alert('로그인이 필요합니다.');
                    navigate('/mobile-login');
                    return;
                }

                console.log('Fetching info for userId:', user.userId);
                const response = await AdditionalInfoAPI.getAgentInfo(user.userId);
                
                if (response) {
                    setFormData({
                        title: response.title || '',
                        content: response.content || '',
                        registrationNumber: response.registrationNumber || '',
                        tel: response.tel || '',
                        address: response.address || '',
                        latitude: response.latitude || '',
                        longitude: response.longitude || '',
                        dongcode: response.dongCode || ''
                    });
                }
            } catch (error) {
                console.error('사용자 정보 로딩 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요합니다.');
                    navigate('/mobile-login');
                } else {
                    alert('정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
                }
            }
        };

        fetchUserInfo();
    }, [navigate]);

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
                latitude: parseFloat(coords.entY),
                longitude: parseFloat(coords.entX),
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
                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);
                
                if (!user || !user.userId) {
                    alert('로그인이 필요합니다.');
                    navigate('/mobile-login');
                    return;
                }

                const apiRequestData = {
                    title: formData.title,
                    content: formData.content,
                    registrationNumber: formData.registrationNumber,
                    tel: formData.tel,
                    address: formData.address,
                    y: String(formData.latitude),
                    x: String(formData.longitude),
                    dongcode: formData.dongcode
                };

                console.log('Submitting data:', apiRequestData);
                const response = await AdditionalInfoAPI.updateAgentInfo(user.userId, apiRequestData);
                
                if (response) {
                    navigate('/mobile-my-page');
                }
            } catch (error) {
                console.error('정보 수정 실패:', error);
                alert('정보 수정에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };
    return (
        <div className="additional-info-container">
            <div className="additional-info-wrapper">
                <form onSubmit={handleSubmit} className="info-form">
                    <div className="form-group">
                        <label className="form-label">중개사무소이름</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="이걸루중개사무소"
                        />
                        {errors.title && <p className="error-message">{errors.title}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">중개사무소소개</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="중개사무소를 소개해주세요!"
                        />
                        {errors.content && <p className="error-message">{errors.content}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">사업자등록번호</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="000-00-00000"
                        />
                        {errors.registrationNumber && <p className="error-message">{errors.registrationNumber}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">전화번호</label>
                        <input
                            type="tel"
                            name="tel"
                            value={formData.tel}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="010-0000-0000"
                        />
                        {errors.tel && <p className="error-message">{errors.tel}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">주소</label>
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
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>

                    <button type="submit" className="submit-button">
                        수정하기
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
}

export default MobileMyPageEdit;