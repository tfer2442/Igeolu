import { useState } from 'react';
import axios from 'axios';

const AddressSearch = ({ onSelect }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    
    // 도로명주소api
    const JUSO_KEY = 'U01TX0FVVEgyMDI1MDIwMzE1MTIyOTExNTQ0MDQ=';
    // 좌표정보api
    const COORD_KEY = 'U01TX0FVVEgyMDI1MDIwMzE1MTExNTExNTQ0MDM= ';

    const searchAddress = async () => {
        if (!keyword.trim()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(
                `https://business.juso.go.kr/addrlink/addrLinkApi.do`, {
                    params: {
                        currentPage: 1,
                        countPerPage: 10,
                        keyword: keyword,
                        confmKey: JUSO_KEY,
                        resultType: 'json'
                    }
                }
            );
            
            const data = response.data;
            
            if (data.results?.common?.errorCode === '0') {
                setResults(data.results.juso || []);
                setIsVisible(true);
            } else {
                throw new Error(data.results?.common?.errorMessage || '주소 검색에 실패했습니다.');
            }
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const getCoordinates = async (admCd, rnMgtSn, udrtYn, buldMnnm, buldSlno) => {
        try {
            const response = await axios.get(
                'https://business.juso.go.kr/addrlink/addrCoordApi.do', {
                    params: {
                        admCd,
                        rnMgtSn,
                        udrtYn,
                        buldMnnm,
                        buldSlno,
                        confmKey: COORD_KEY,
                        resultType: 'json'
                    }
                }
            );
            
            const data = response.data;
            
            if (data.results?.common?.errorCode === '0') {
                const coordInfo = data.results.juso[0];
                return {
                    entX: coordInfo.entX,
                    entY: coordInfo.entY
                };
            }
            throw new Error('좌표를 찾을 수 없습니다.');
        } catch (error) {
            console.error('좌표 변환 실패:', error);
            return null;
        }
    };

    const handleSelect = async (result) => {
        try {
            const coords = await getCoordinates(
                result.admCd,      //행정동코드!!
                result.rnMgtSn,
                result.udrtYn,
                result.buldMnnm,
                result.buldSlno
            );
            
            onSelect({
                fullAddress: result.roadAddr,
                latitude: coords?.entY || 0,
                longitude: coords?.entX || 0,
                dongCode: result.admCd  //행정동코드!!
            });
            
            setIsVisible(false);
            setKeyword('');
        } catch (error) {
            console.error('주소 선택 처리 실패:', error);
            onSelect({
                fullAddress: result.roadAddr,
                latitude: 0,
                longitude: 0,
                dongCode: result.admCd  
            });
        }
    };

    return (
        <div className="address-search">
            <div className="search-input">
                <input 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                    placeholder="도로명주소 검색어를 입력하세요"
                />
                <button 
                    onClick={searchAddress}
                    disabled={loading}
                >
                    {loading ? '검색중...' : '검색'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isVisible && results.length > 0 && (
                <div className="address-results">
                    {results.map((result, index) => (
                        <div 
                            key={index}
                            className="address-item"
                            onClick={() => handleSelect(result)}
                        >
                            <p className="road-address">{result.roadAddr}</p>
                            <p className="jibun-address">[지번] {result.jibunAddr}</p>
                            <p className="address-detail">
                                {result.zipNo} ({result.admCd})
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && results.length === 0 && keyword && (
                <div className="no-results">
                    검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
};

export default AddressSearch;