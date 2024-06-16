import React, { useEffect, useState } from "react";
import { MODES, sendDesktopNotification } from "../../Helper/Helper";
import ToggleBtn from "../../Helper/ToggleBtn/ToggleBtn";
import { useSelector } from "react-redux";
import SettingService from "../../Services/SettingService";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";

const Settings = ({ handleTheme }) => {
  // States
  const theme = useSelector((state) => state.theme);
  const auth = useSelector((state) => state.auth);
  const [loader,setLoader] = useState(false);
  // Methods

  // Settings Array
  const settings = [
    {
      name: "Appearance",
      description: "Customize how your theme looks on your device",
      selectOptions: [
        {
          value: MODES.LIGHT,
          text: "Light",
          selected: theme.mode === MODES.LIGHT ? true : false,
        },
        {
          value: MODES.DARK,
          text: "Dark",
          selected: theme.mode === MODES.DARK ? true : false,
        },
      ],
      handleSelect: (mode) => handleTheme(mode),
    },
    {
      name: "Language",
      description: "Select your language",
      selectOptions: [
        { text: "English", value: "en", selected: true },
        { text: "Chinese", value: "zh", selected: false },
        { text: "Spanish", value: "es", selected: false },
        { text: "Arabic", value: "ar", selected: false },
        { text: "German", value: "de", selected: false },
        { text: "Portuguese", value: "pt", selected: false },
        { text: "Russian", value: "ru", selected: false },
        { text: "French", value: "fr", selected: false },
        { text: "Japanese", value: "ja", selected: false },
        { text: "Hindi", value: "hi", selected: false },
      ],
      handleSelect: () => {},
    },
    {
      name: "Mobile Push Notifications",
      description: "Receive push notification",
      type: "mobile_notify",
    },
    {
      name: "Desktop Notification",
      description: "Receive push notification  in desktop",
      type: "desktop_notify",
    },
    {
      name: "Email Notifications",
      description: "Receive email notification",
      type: "email_notify",
    },
  ];
  const [data, setData] = useState(null);

  const handleToggleChange = async (val, opt) => {
    if (data[opt] !== val) {
      setLoader(true)
      await SettingService.update(data.id, { ...data, [opt]: val });
      setData({ ...data, [opt]: val });
      toast.success("Setting Updated Successfully");
      setLoader(false)
    }
  };

  const getData = async () => {
    setLoader(true)
    const val = await SettingService.read(
      await SettingService.getSettingID(auth.user?.id)
    );
    setData(val);
    setLoader(false)
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="Settings">
      {data === null || loader ? (
        <Loader size={50} fullHeight fullWidth />
      ) : (
        settings.map((setting, key) => (
          <div key={key} className="setting">
            <div className="left">
              <h3>{setting.name}</h3>
              <h5>{setting.description}</h5>
            </div>
            <div className="right">
              {setting.selectOptions ? (
                <select
                  onChange={(e) => setting.handleSelect(e.target.value)}
                  className="select"
                >
                  {setting.selectOptions.map((x, i) => (
                    <option key={i} value={x.value} selected={x.selected}>
                      {x.text}
                    </option>
                  ))}
                </select>
              ) : (
                <ToggleBtn
                  onToggle={(val) => handleToggleChange(val, setting.type)}
                  initialValue={data === null ? true : data[setting.type]}
                  size={window.innerWidth < 599 ? 15 : 20}
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Settings;
