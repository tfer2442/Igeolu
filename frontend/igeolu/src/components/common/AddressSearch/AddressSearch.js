// components/AddressSearch/AddressSearch.js
import { useState } from 'react';

const AddressSearch = ({ onSelect }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    
    const API_KEY = 'U01TX0FVVEgyMDI1MDIwMzE1MTIyOTExNTQ0MDQ=';

    const searchAddress = async () => {
        if (!keyword.trim()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(
                `https://business.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=10&keyword=${encodeURIComponent(keyword)}&confmKey=${API_KEY}&resultType=json`
            );
            
            const data = await response.json();
            
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

    const handleSelect = (result) => {
        onSelect({
            fullAddress: result.roadAddr,
            latitude: 0,
            longitude: 0,
            dongCode: result.admCd
        });
        setIsVisible(false);
        setKeyword('');
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