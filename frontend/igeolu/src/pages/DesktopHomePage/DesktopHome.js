import DesktopMainPageNav from '../../components/DesktopNav/DesktopMainPageNav'

function DesktopHome() {
  const handleLoginSigninClick = () => {
    console.log('로그인 |회원가입');
  };
    return (
      <div className='desktop-home-page'>
        <DesktopMainPageNav onLoginSigninClick={handleLoginSigninClick} />

      </div>
    );
  }
  
  export default DesktopHome;
