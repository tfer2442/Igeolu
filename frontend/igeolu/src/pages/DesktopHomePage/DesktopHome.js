import DesktopMainPageNav from '../../components/DesktopNav/DesktopMainPageNav'
import MainVideo from '../../assets/videos/메인영상.mp4'
import './DesktopHome.css'
import rightTopBlock from '../../assets/images/우측상단.png'
import leftBottomBlock from '../../assets/images/좌측하단.png'

function DesktopHome() {
  const handleLoginSigninClick = () => {
    console.log('로그인');
  };
    return (
      <div className='desktop-home-page'>
        <DesktopMainPageNav onLoginSigninClick={handleLoginSigninClick} />
        <div className='desktop-home-page-content'>
          <video 
            autoPlay 
            muted 
            loop 
            className="background-video"
          >
            <source src={MainVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <img src={rightTopBlock} alt="rightTopBlock" className="right-top-block" />
          <img src={leftBottomBlock} alt="leftBottomBlock" className="left-bottom-block" />
        </div>
      </div>
    );
  }
  
  export default DesktopHome;
