import DesktopLiveAndMyPage from '../../components/DesktopNav/DesktopLiveAndMyPage';
import './DesktopLive.css'

function DesktopLive() {
  return (
    <div className='desktop-live-page'>
      <DesktopLiveAndMyPage />
      <div className='desktop-live-page__content'>
      <div className='desktop-live-page__left-content'>
        <div className='desktop-live-page__left-content__live-video'></div>
        <div className='desktop-live-page__left-content__bottom-content'>
          <div className='desktop-live-page__left-content__bottom-content__ai-checklist'></div>
          <div className='desktop-live-page__left-content__bottom-content__live-order-list'></div>
        </div>
      </div>
      <div className='desktop-live-page__right-content'>
        <div className='desktop-live-page__right-content__memo'></div>
        <div className='desktop-live-page__right-content__my-cam'></div>
      </div>
      </div>
    </div>
  );
}

export default DesktopLive;
