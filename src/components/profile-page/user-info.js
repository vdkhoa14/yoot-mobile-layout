import React from 'react';
import {
    IconButton,
    Drawer,
    TextField,
    Button,
    NativeSelect,
    FormControl,
    Menu,
    MenuItem,
} from '@material-ui/core'
import {
    MoreHoriz as MoreHorizIcon,
    PlayArrow as PlayArrowIcon,
    ChevronLeft as ChevronLeftIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import moment from 'moment'
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import { Dates, Mounths, Privacies } from '../../constants/constants'
import { get, post } from '../../api';
import { showNotification, objToArray } from '../../utils/common';
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import { connect } from "react-redux"
import { Loader } from '../common/loader'
import {NumberFormatCustom} from '../../utils/common'

export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showUpdateForm: false,
            gender: null,
            email: "",
            address: "",
            fullName: "",
            isUpdatePreccessing: false,
            phone: "",
            anchor: null,
            addressPrivacy: Privacies.Public,
            dateOfBirthPrivacy: Privacies.Public,
            yearOfBirthPrivacy: Privacies.Public,
            genderPrivacy: Privacies.Public
        };
    }

    _handleSetDefault() {
        let { data } = this.props
        if (!data) return

        let defaultAddressPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 1).levelid || 2
        let defaultDateOfBirthPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 2).levelid || 2
        let defaultYearOfBirthPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 3).levelid || 2
        let defaultGenderPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 4).levelid || 2
        let PrivaciesOptions = objToArray(Privacies)

        this.setState({
            fullName: data.fullname,
            email: data.email,
            address: data.address,
            gender: data.gender == 0 ? "Nam" : "Nữ",
            dateOfBirth: moment(data.birthday).format("D"),
            mounthOfBirth: moment(data.birthday).format("M"),
            yearOfBirth: moment(data.birthday).year(),
            phone: data.phone,
            addressPrivacy: PrivaciesOptions.find(item => item.code == defaultAddressPrivacy),
            dateOfBirthPrivacy: PrivaciesOptions.find(item => item.code == defaultDateOfBirthPrivacy),
            yearOfBirthPrivacy: PrivaciesOptions.find(item => item.code == defaultYearOfBirthPrivacy),
            genderPrivacy: PrivaciesOptions.find(item => item.code == defaultGenderPrivacy)
        })
    }

    updateProfile() {
        let {
            email,
            address,
            fullName,
            gender,
            dateOfBirth,
            mounthOfBirth,
            yearOfBirth,
            phone,
            addressPrivacy,
            dateOfBirthPrivacy,
            yearOfBirthPrivacy,
            genderPrivacy
        } = this.state
        this.setState({
            isUpdatePreccessing: true
        })
        let param = {
            phone: phone,
            email: email,
            name: fullName,
            gender: gender == "Nam" ? 0 : 1,
            address: address,
            birthday: moment(dateOfBirth + "/" + mounthOfBirth + "/" + yearOfBirth, "DD/MM/YYYY").format()
        }
        let privacys = [
            {
                authorizeinfoid: 1, //Địa chỉ
                levelid: addressPrivacy.code
            },
            {
                authorizeinfoid: 2, //Ngày sinh
                levelid: dateOfBirthPrivacy.code
            },
            {
                authorizeinfoid: 3, //Năm sinh
                levelid: yearOfBirthPrivacy.code
            },
            {
                authorizeinfoid: 4, //Giới tính
                levelid: genderPrivacy.code
            }
        ]
        console.log("privacys", privacys)
        post(SOCIAL_NET_WORK_API, "User/EditProfile", param, result => {
            if (result.result == 1) {
                this.getProfile()

                post(SOCIAL_NET_WORK_API, "User/SetAuthorizeUser", privacys, result => {
                    this.setState({
                        showUpdateForm: false
                    })
                })

            }
            else {
                showNotification("", result.message, null)
            }
            this.setState({ isUpdatePreccessing: false })
        })
    }

    getProfile() {
        get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
            if (result.result == 1) {
                this.props.setUserProfile(result.content.user)
                this.props.getFolowedMe(0)
                this.props.getMeFolowing(0)
                this.setState({ isUpdatePreccessing: false })
            } else {
                showNotification("", <span className="app-noti-message">{result.message}</span>, null)
            }

        })
    }

    componentDidMount() {
        this._handleSetDefault()
    }

    render() {
        let {
            showUpdateForm,
            gender,
            fullName,
            email,
            address,
            dateOfBirth,
            mounthOfBirth,
            yearOfBirth,
            isUpdatePreccessing,
            anchor,
            showAddressPrivacyList,
            addressPrivacy,
            dateOfBirthPrivacy,
            showDateOfBirthPrivacyList,
            showYearOfBirthPrivacyList,
            yearOfBirthPrivacy,
            genderPrivacy,
            showGenderPrivacyList
        } = this.state
        let {
            data
        } = this.props
        let PrivaciesOptions = objToArray(Privacies)
        return (
            <div className="content-box">
                <label>
                    <PlayArrowIcon />
                    <span>Thông tin cá nhân</span>
                </label>
                <ul>
                    <li>
                        <label className="name">{data.fullname}</label>
                    </li>
                    <li>
                        <label>Email: </label>
                        <span>{data.email}</span>
                    </li>
                    <li>
                        <label>Ngày sinh: </label>
                        <span>{moment(data.birthday).format("DD/MM/YYYY")}</span>
                    </li>
                    <li>
                        <label>Giới tính: </label>
                        <span>{data.gendertext}</span>
                    </li>
                </ul>
                <IconButton onClick={() => this.setState({ showUpdateForm: true }, () => this._handleSetDefault())}>
                    <MoreHorizIcon />
                </IconButton>

                <Drawer anchor="bottom" className="drawer-form" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showUpdateForm: false })}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Cập nhật thông tin cá nhân</label>
                    </div>
                    <div className="form-content">
                        <div className='input-field'>
                            <label>Tên <span className="red">(*)</span></label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập tên"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={fullName}
                                onChange={e => this.setState({ fullName: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Email <span className="red">(*)</span></label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập email"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>
                                Địa chỉ
                                 <IconButton onClick={(e) => this.setState({ showAddressPrivacyList: true, anchor: e.target })}>
                                    {
                                        addressPrivacy ? <img src={addressPrivacy.icon}></img> : ""
                                    }
                                    <ExpandMoreIcon />
                                </IconButton>
                                <Menu
                                    className="privacy-menu"
                                    anchorEl={anchor}
                                    keepMounted
                                    open={showAddressPrivacyList}
                                    onClose={() => this.setState({ showAddressPrivacyList: false })}
                                >
                                    {
                                        PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showAddressPrivacyList: false, addressPrivacy: privacy })}>
                                            <img src={privacy.icon1} />
                                            <div>
                                                <label>{privacy.label}</label>
                                                <span>{privacy.description}</span>
                                            </div>
                                        </MenuItem>)
                                    }
                                </Menu>
                            </label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập địa chỉ"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={address}
                                onChange={e => this.setState({ address: e.target.value })}
                            />
                        </div>
                        <div className="custom-input-field">
                            <div className='input-field'>
                                <label>
                                    Ngày sinh
                                     <IconButton onClick={(e) => this.setState({ showDateOfBirthPrivacyList: true, anchor: e.target })}>
                                        {
                                            dateOfBirthPrivacy ? <img src={dateOfBirthPrivacy.icon}></img> : ""
                                        }
                                        <ExpandMoreIcon />
                                    </IconButton>
                                    <Menu
                                        className="privacy-menu"
                                        anchorEl={anchor}
                                        keepMounted
                                        open={showDateOfBirthPrivacyList}
                                        onClose={() => this.setState({ showDateOfBirthPrivacyList: false })}
                                    >
                                        {
                                            PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showDateOfBirthPrivacyList: false, dateOfBirthPrivacy: privacy })}>
                                                <img src={privacy.icon1} />
                                                <div>
                                                    <label>{privacy.label}</label>
                                                    <span>{privacy.description}</span>
                                                </div>
                                            </MenuItem>)
                                        }
                                    </Menu>
                                </label>
                                <div className="date-select">
                                    <FormControl variant="outlined" className={"custom-select"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={dateOfBirth}
                                            onChange={(e) => this.setState({ dateOfBirth: e.target.value })}
                                        >
                                            {
                                                Dates.map((date, index) => <option key={index} value={index + 1}>{date}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl variant="outlined" className={"custom-select ml15"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={mounthOfBirth}
                                            onChange={(e) => this.setState({ mounthOfBirth: e.target.value })}
                                        >
                                            {
                                                Mounths.map((month, index) => <option key={index} value={index + 1}>{month}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                </div>
                            </div>
                            <div className='input-field year-input'>
                                <label>
                                    Năm sinh
                                     <IconButton onClick={(e) => this.setState({ showYearOfBirthPrivacyList: true, anchor: e.target })}>
                                        {
                                            yearOfBirthPrivacy ? <img src={yearOfBirthPrivacy.icon}></img> : ""
                                        }
                                        <ExpandMoreIcon />
                                    </IconButton>
                                    <Menu
                                        className="privacy-menu"
                                        anchorEl={anchor}
                                        keepMounted
                                        open={showYearOfBirthPrivacyList}
                                        onClose={() => this.setState({ showYearOfBirthPrivacyList: false })}
                                    >
                                        {
                                            PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showYearOfBirthPrivacyList: false, yearOfBirthPrivacy: privacy })}>
                                                <img src={privacy.icon1} />
                                                <div>
                                                    <label>{privacy.label}</label>
                                                    <span>{privacy.description}</span>
                                                </div>
                                            </MenuItem>)
                                        }
                                    </Menu>
                                </label>
                                <div>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Nhập năm sinh"
                                        value={yearOfBirth}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                          }}
                                        onChange={e => this.setState({ yearOfBirth: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='input-field  mt10'>
                            <label>
                                Giới tính
                                 <IconButton onClick={(e) => this.setState({ showGenderPrivacyList: true, anchor: e.target })}>
                                    {
                                        genderPrivacy ? <img src={genderPrivacy.icon}></img> : ""
                                    }
                                    <ExpandMoreIcon />
                                </IconButton>
                                <Menu
                                    className="privacy-menu"
                                    anchorEl={anchor}
                                    keepMounted
                                    open={showGenderPrivacyList}
                                    onClose={() => this.setState({ showGenderPrivacyList: false })}
                                >
                                    {
                                        PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showGenderPrivacyList: false, genderPrivacy: privacy })}>
                                            <img src={privacy.icon1} />
                                            <div>
                                                <label>{privacy.label}</label>
                                                <span>{privacy.description}</span>
                                            </div>
                                        </MenuItem>)
                                    }
                                </Menu>
                            </label>
                            <div className="gender-select">
                                <span className="title">Giới tính</span>
                                <div className="options">
                                    <span className={gender == "Nam" ? "active" : ""} onClick={() => this.setState({ gender: "Nam" })}>Nam</span>
                                    <span className={gender == "Nữ" ? "active" : ""} onClick={() => this.setState({ gender: "Nữ" })}>Nữ</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.updateProfile()}>Lưu thông tin</Button>

                        {
                            isUpdatePreccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                        }
                    </div>
                </Drawer>
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => ({
    setUserProfile: (user) => dispatch(setUserProfile(user)),
    getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
    getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage))
});

export default connect(
    null,
    mapDispatchToProps
)(Index);
