import './Registration_Edit.css';
import { useState, useEffect } from 'react'
import axios from 'axios';
import Registration_Button from '../../components/common/Registration_Button/Registration_Button';
import BackButton from '../../components/common/Back_Button/Back_Button';
import AddressSearch from '../../components/common/AddressSearch/AddressSearch';

const Registration_Edit = () => {
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [optionsList, setOptionsList] = useState([]);
    const [optionsMap, setOptionsMap] = useState({});

    const [description, setDescription] = useState('');
    const [deposit, setDeposit] = useState('');
    const [monthlyRent, setMonthlyRent] = useState('');
    const [area, setArea] = useState('');
    const [approvalDate, setApprovalDate] = useState('');
    const [currentFloor, setCurrentFloor] = useState('');
    const [totalFloors, setTotalFloors] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [address, setAddress] = useState('');
    const [propertyId, setPropertyId] = useState(null);

    useEffect(() => {
        const init = async () => {
            await fetchOptions();
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                setPropertyId(id);
                await fetchPropertyData(id);
            }
        };
        init();
    }, []);

    const fetchOptions = async () => {
        try {
            const { data } = await axios.get('https://i12d205.p.ssafy.io/api/options');
            
            if (data.statusCode === 200) {
                const options = data.result;
                const optMap = {};
                const optList = options.map(opt => {
                    optMap[opt.name] = opt.id;
                    return opt.name;
                });
                
                setOptionsList(optList);
                setOptionsMap(optMap);
            }
        } catch (error) {
            console.error('옵션 로딩 실패:', error);
        }
    };

    const fetchPropertyData = async (id) => {
        try {
            const { data } = await axios.get(`https://i12d205.p.ssafy.io/properties/${id}`);
            
            if (data.statusCode === 200) {
                const property = data.result;
                
                setDescription(property.description);
                setDeposit(property.deposit);
                setMonthlyRent(property.monthlyRent);
                setArea(property.area);
                setApprovalDate(property.approvalDate);
                setCurrentFloor(property.currentFloor);
                setTotalFloors(property.totalFloors);
                setSelectedAddress({
                    fullAddress: property.address,
                    latitude: property.latitude,
                    longitude: property.longitude,
                    dongCode: property.dongCode
                });
                setAddress(property.address);
                
                const optionNames = property.propertyOption.name;
                setSelectedOptions(optionNames);
                setImages(property.images);
            }
        } catch (error) {
            console.error('매물 정보 로딩 실패:', error);
            alert('매물 정보를 불러오는데 실패했습니다.');
        }
    };

    const toggleOptions = () => {
        console.log('현재 옵션 목록:', optionsList);
        setOptionsVisible(!optionsVisible);
    };

    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setImages([...images, ...imageUrls]);
        setImageFiles([...imageFiles, ...files]);
    };

    const edit_message = async () => {
        try {
            if (!selectedAddress) {
                alert('주소를 선택해주세요.');
                return;
            }

            if (!description || !deposit || !monthlyRent || !area || 
                !approvalDate || !currentFloor || !totalFloors) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }

            const requestData = {
                userId: 12345,
                description,
                deposit: Number(deposit),
                monthlyRent: Number(monthlyRent),
                area: Number(area),
                approvalDate,
                currentFloor: Number(currentFloor),
                totalFloors: Number(totalFloors),
                address: selectedAddress.fullAddress,
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude,
                dongCode: selectedAddress.dongCode,
                propertyOption: {
                    name: selectedOptions.map(option => optionsMap[option])
                },
                images: images
            };

            const { data } = await axios.put(
                `http://192.168.0.4:3000/api/properties/${propertyId}`, 
                requestData,
                {
                    headers: {
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                    }
                }
            );

            if (data.statusCode === 200) {
                alert("매물이 수정되었습니다!");
                window.history.back();
            } else {
                throw new Error('매물 수정에 실패했습니다.');
            }
        } catch (error) {
            alert('매물 수정 중 오류가 발생했습니다.');
            console.error('Error:', error);
        }
    };

    const complete_message = async () => {
        if (!window.confirm('거래완료 처리하시겠습니까?')) {
            return;
        }

        try {
            const { data } = await axios.delete(
                `http://192.168.0.4:3000/api/properties/${propertyId}`,
                {
                    headers: {
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                    }
                }
            );

            if (data.statusCode === 200) {
                alert("거래완료 처리되었습니다!");
                window.history.back();
            } else {
                throw new Error('처리에 실패했습니다.');
            }
        } catch (error) {
            alert('처리 중 오류가 발생했습니다.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="Registration">
            <BackButton onClick={handleBack} />

            <div>
                <h2>매물 등록</h2>
            </div>

            <div className="Registration_input">
                <div className="Block">
                    <label>매물 소개</label>
                    <div className='Imagie_input'>
                        <textarea 
                            className="Introduction"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                        />
                    </div>
                </div>

                <div className="Block">
                    <label>보증금/월세</label>
                    <div className="S_input">
                        <input
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            placeholder="보증금"
                        />
                        <input
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(e.target.value)}
                            placeholder="월세"
                        />
                    </div>
                </div>

                <div className="Block">
                    <label>전용면적</label>
                    <input
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    />
                </div>

                <div className="Block">
                    <label>사용승인일</label>
                    <input
                        value={approvalDate}
                        onChange={(e) => setApprovalDate(e.target.value)}
                    />
                </div>

                <div className="Block">
                    <label>해당층/총층</label>
                    <div className="S_input">
                        <input
                            value={currentFloor}
                            onChange={(e) => setCurrentFloor(e.target.value)}
                            placeholder="해당층"
                        />
                        <input
                            value={totalFloors}
                            onChange={(e) => setTotalFloors(e.target.value)}
                            placeholder="총층"
                        />
                    </div>
                </div>

                <div className="Block">
                    <label>도로명 주소</label>
                    <AddressSearch 
                        onSelect={(address) => {
                            setSelectedAddress(address);
                            setAddress(address.fullAddress);
                        }} 
                    />
                    {selectedAddress && (
                        <input 
                            value={address}
                            readOnly
                            className="selected-address"
                        />
                    )}
                </div>
            </div>

            <div className="Registration_input">
                <div className="Block">
                    <label onClick={toggleOptions} className="toggle-label">
                        옵션 {optionsVisible ? '▲' : '▼'}
                    </label>
                    {optionsVisible && (
                        <div className="Options">
                            {optionsList.map((option, index) => (
                                <span
                                    key={index}
                                    className={`Option ${selectedOptions.includes(option) ? 'selected' : ''}`}
                                    onClick={() => toggleOption(option)}
                                >
                                    {option}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="ButtonContainer">
                    <Registration_Button onClick={edit_message}>수정</Registration_Button>
                    <Registration_Button onClick={complete_message}>거래완료</Registration_Button>
                </div>
            </div>
        </div>
    );
}

export default Registration_Edit