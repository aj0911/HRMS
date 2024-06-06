import React from "react";
import { MODES } from "../../Helper/Helper";
import ToggleBtn from "../../Helper/ToggleBtn/ToggleBtn";
import { useDispatch, useSelector } from "react-redux";

const Settings = ({handleTheme}) => {
  // States
  const theme = useSelector((state) => state.theme);

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
      toggleOption: false,
    },
    {
      name: "Desktop Notification",
      description: "Receive push notification  in desktop",
      toggleOption: false,
    },
    {
      name: "Email Notifications",
      description: "Receive email notification",
      toggleOption: true,
    },
  ];
  return (
    <div className="Settings">
      {settings.map((setting, key) => (
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
              <ToggleBtn value={setting.toggleOption} size={20} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Settings;
