import React from 'react';
import axios from 'axios';

function Login() {

  // 1) 카카오 로그인
  const onKakaoLogin = () => {
    // 백엔드 카카오 소셜 로그인 엔드포인트로 리다이렉트
    window.location.href = "https://i12d205.p.ssafy.io/api/oauth2/authorization/kakao?state=realtor";
  };

  // 2) 백엔드 API 테스트 (GET /my) - 이미 작성하신 예시
  const testRequest = () => {
    axios
      .get("http://localhost:8080/my", { withCredentials: true })
      .then((res) => {
        alert(JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        window.location.href = "https://i12d205.p.ssafy.io/api/oauth2/authorization/kakao";
      });
  };

  // 3) 카카오 로그아웃
  const onKakaoLogout = () => {
    axios
      .get("https://i12d205.p.ssafy.io/api/logout", { withCredentials: true })
      .then((res) => {
        alert(JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  // 4) [추가] /api/users/me 호출
  // 백엔드에서 MeGetResponseDto 형태의 JSON을 리턴한다고 가정
  const fetchUserInfo = () => {
    axios
      .get("https://i12d205.p.ssafy.io/api/users/me", { withCredentials: true })
      .then((res) => {
        // res.data 는 { userId: number, role: string } 형태일 것
        const { userId, role } = res.data;
        console.log("유저 정보:", userId, role);
        alert(`유저 ID: ${userId}\n권한: ${role}`);
      })
      .catch((error) => {
        console.error("유저 정보 불러오기 실패:", error);
        // 필요 시 로그인 페이지로 이동 등 처리
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={onKakaoLogin}>Kakao Login</button>
      <button onClick={testRequest}>테스트 API 호출</button>
      <button onClick={onKakaoLogout}>Kakao Logout</button>

      {/* /api/users/me 호출 테스트 버튼 */}
      <button onClick={fetchUserInfo}>유저 정보 가져오기</button>
    </div>
  );
}

export default Login;