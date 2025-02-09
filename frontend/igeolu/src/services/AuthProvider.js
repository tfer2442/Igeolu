// src/services/AuthProvider.js
import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 생성
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // { userId, role } 저장

    useEffect(() => {
        // 로그인 상태 확인 (백엔드에서 쿠키 인증)
        fetch("http://i12d205.p.ssafy.io/api/user", {
            method: "GET",
            credentials: "include", // 쿠키 포함
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.userId) {
                setUser({ userId: data.userId, role: data.role });
            }
        })
        .catch((err) => console.error("Error fetching user:", err));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Context 사용하기 위한 Hook 생성
export function useAuth() {
    return useContext(AuthContext);
}
