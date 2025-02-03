const KAKAO_CLIENT_ID = "YOUR_KAKAO_REST_API_KEY";
// 카카오가 다시 돌려보낼 URL
const REDIRECT_URI = "http://localhost:3000/auth/kakao/callback";

const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const KakaoLogin = () => {
    return (
        <a href={kakaoLoginUrl}>
            카카오 로그인
        </a>
    );
};

export default KakaoLogin;