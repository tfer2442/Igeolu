import React, { useState } from 'react';
import './Memo2.css';
import { BiBold, BiUnderline } from "react-icons/bi";
import { BsListUl } from "react-icons/bs";

function Memo2() {
    const [inputText, setInputText] = useState('');
    const [contents, setContents] = useState([]);
    const [isBold, setIsBold] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isList, setIsList] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newContent = {
                text: inputText,
                bold: isBold,
                underline: isUnderline,
                list: isList
            };
            setContents([...contents, newContent]);
            setInputText('');
        }
    };

    const renderContent = (content, index) => {
        let style = {};
        if (content.bold) style.fontWeight = 'bold';
        if (content.underline) style.textDecoration = 'underline';
        
        return content.list ? (
            <li key={index} style={style}>{content.text}</li>
        ) : (
            <div key={index} style={style}>{content.text}</div>
        );
    };

    return (
      <div className='memo-container'>
        <div className='memo-title'></div>
        <div className='memo-content'>
            {isList ? (
                <ul>
                    {contents.map((content, index) => renderContent(content, index))}
                </ul>
            ) : (
                contents.map((content, index) => renderContent(content, index))
            )}
        </div>
        <div className='memo-toolbar'>
            <button 
                onClick={() => setIsBold(!isBold)}
                className={isBold ? 'active' : ''}
            >
                <BiBold />
            </button>
            <button 
                onClick={() => setIsUnderline(!isUnderline)}
                className={isUnderline ? 'active' : ''}
            >
                <BiUnderline />
            </button>
            <button 
                onClick={() => setIsList(!isList)}
                className={isList ? 'active' : ''}
            >
                <BsListUl />
            </button>
        </div>
        <div className='memo-input'>
            <input 
                type="text" 
                placeholder="내용을 입력하세요"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
      </div>
    );
}

export default Memo2;
