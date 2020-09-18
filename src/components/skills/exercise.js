import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import { connect } from 'react-redux'
import {
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Button,
  Avatar,
  Drawer
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Cancel as CancelIcon
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import SwipeableViews from 'react-swipeable-views';
import Dropzone from 'react-dropzone'

const practice1 = require('../../assets/icon/practice1.png')
const evaluate = require('../../assets/icon/evaluate.png')
const Newfeed = require('../../assets/icon/Lesson.png')
const Coins_Y = require('../../assets/icon/Coins_Y.png')
const IMG_1038 = require('../../assets/images/IMG_1038.jpg')
const Logo_y = require('../../assets/icon/Logo_y@1x.png')
const upload_video = require('../../assets/icon/upload_video.png')




class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    let {
      tabIndex
    } = this.state
    return (
      <div className="exercise-item-page" >
        <StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="exercise-header">
                  <div className="lesson-info">
                    <label>{lesson.name}</label>
                    <div className="bg" style={{ background: "url(" + lesson.background + ")" }}></div>
                  </div>
                  <div className="menu">
                    <AppBar position="static" color="default" className={"custom-tab"}>
                      <Tabs
                        value={tabIndex}
                        onChange={(e, value) => this.setState({ tabIndex: value })}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        className="tab-header"
                      >
                        <Tab label="Bài tập" {...a11yProps(0)} className="tab-item" />
                        <Tab label="Lịch sử làm bài" {...a11yProps(1)} className="tab-item" />
                      </Tabs>
                    </AppBar>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="lesson-list">
            <SwipeableViews
              index={tabIndex}
              onChangeIndex={(value) => this.setState({ tabIndex: value })}
              className="tab-content"
            >
              <TabPanel value={tabIndex} index={0} className="content-box">
                <div className="exercise-list">
                  <label>Đã hoàn thành 0 / 1</label>
                  <div className="exercise-item">
                    <div>
                      <label>Bài tập</label>
                      <span className="reward">
                        <span>Thưởng hoàn thành: 2000</span>
                        <img src={Coins_Y} />
                      </span>
                    </div>
                    <img src={IMG_1038} />
                    <Button className="bt-submit" onClick={() => this.setState({ showApplyDrawer: true })}>Làm bài</Button>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={tabIndex} index={1} >
                <div className="history">
                  <div className="notification">
                    <span>Đây là danh sách bài thực hành đã được đánh giá. Nếu chưa hài lòng với kết quả này, bạn có thể yêu cầu đánh giá lại, điểm chấm nào cao nhất sẽ được chọn tính vào điểm YOOT.</span>
                  </div>
                  <div className="reports">
                    <label>Bài tập</label>
                    <ul className="tasks">
                      <li>
                        <div className='task-header'>
                          <span className="task-name">Bài số 1</span>
                          <div className="task-actions">
                            <Button className="bt-submit outline" onClick={() => this.setState({ showAddAssessDrawer: true })}>Đánh giá lại</Button>
                            <Button className="bt-cancel">Xoá</Button>
                          </div>
                        </div>
                        <div className="task-content">
                          <video controls>
                            <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
                          </video>
                        </div>
                        <div className="assess">
                          <span>Được đánh giá bởi</span>
                          <div>
                            <div className="assessor">
                              <Avatar className="avatar">
                                <img src={Logo_y} />
                              </Avatar>
                              <span>YOOT</span>
                            </div>
                            <div className="status">Chờ đánh giá</div>
                          </div>
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRPFUhaUhx8Vmm3YTv30zZhpq86p5YgOQUk5Q&usqp=CAU" />
                        </div>
                        <Button onClick={() => this.setState({ showApplyDrawer: true })}>Làm lại bài tập</Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </StickyContainer>
        {
          renderApplyDrawer(this)
        }
        {
          renderAddAssessDrawer(this)
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header">
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.props.history.push('/skills')}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Thực hành</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => history.push("/skills/2131")}>
          <img src={Newfeed}></img>
          <span >Bài học</span>
        </li>
        <li>
          <img src={practice1}></img>
          <span style={{ color: "#f54746" }}>Thực hành</span>
        </li>
        <li onClick={() => history.push("/skills/1219/assess")}>
          <img src={evaluate}></img>
          <span >Đánh giá</span>
        </li>
      </ul>
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

const renderAddAssessDrawer = (component) => {
  let {
    showAddAssessDrawer,
  } = component.state

  return (
    <Drawer anchor="bottom" className="add-assess-drawer" open={showAddAssessDrawer} onClose={() => component.setState({ showAddAssessDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showAddAssessDrawer: false })}>
            <label>Thêm người chấm bài</label>
            <IconButton style={{ padding: "8px" }} >
              <CancelIcon style={{ width: "25px", height: "25px" }} />
            </IconButton>
          </div>
        </div>
        <div className="drawer-content" style={{ overflow: "scroll" }}>
          <ul className="assess-list">
            {
              assessors.map((assess, index) => <li key={index}>
                <div>
                  <Avatar className="avatar"><img src={assess.avatar} /></Avatar>
                  <span>{assess.fullName}</span>
                </div>
                <Button className="bt-submit">Thêm</Button>
              </li>)
            }
          </ul>
        </div>
        <div className="actions">
          <Button className="bt-submit">Thêm bấi kỳ</Button>
          <Button className="bt-cancel">Đóng</Button>
        </div>
      </div>
    </Drawer>
  )
}

const renderApplyDrawer = (component) => {
  let {
    showApplyDrawer,
  } = component.state

  return (
    <Drawer anchor="bottom" className="apply-drawer" open={showApplyDrawer} onClose={() => component.setState({ showApplyDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showApplyDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Nộp bài tập</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
          <div className="apply-form">
            <label>{lesson.name}</label>
            <span>Bài tập: </span>
            <img src={IMG_1038} />
            <span>Bài làm của bạn:</span>
            <Dropzone onDrop={acceptedFiles => component.setState({ videoSelected: acceptedFiles })}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} id="bt-select-video">
                  <input {...getInputProps()} accept="video/*" />
                  <div className="bt-upload">
                    <img src={upload_video} />
                    <span>Tải lên video</span>
                  </div>
                </div>
              )}
            </Dropzone>

            <Button className="bt-submit">Nộp bài</Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}


const lesson = {
  name: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
  lessonCount: 10,
  lessonFinish: 5,
  reward: 500,
  background: "https://andrews.edu.vn/wp-content/uploads/Prensention_mbaandrews.jpg",
  documents: [
    {
      fileName: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
      type: "pdf"
    }
  ],
  lessons: [
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    }
  ]
}

const assessors = [
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  },
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  },
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  }
]

