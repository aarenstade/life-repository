import { FC, ReactNode } from "react";
import SettingsDropdown from "../containers/SettingsDropdown";
import { SettingOption } from "../../types/general";
import React from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const fileOptions: SettingOption[] = []; // Define file options here
  const viewOptions: SettingOption[] = []; // Define view options here
  const optionsOptions: SettingOption[] = []; // Define options options here

  const handleDropdownClick = (setting: SettingOption) => {
    console.log(setting);
  };

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <nav className='flex items-center justify-between bg-black px-4 border-b border-white fixed top-0 left-0 right-0 h-[var(--navbar-height)] z-10'>
        <div className='flex gap-4'>
          <SettingsDropdown options={fileOptions} onClick={handleDropdownClick} component={<p className='text-sm'>File</p>} />
          <SettingsDropdown options={viewOptions} onClick={handleDropdownClick} component={<p className='text-sm'>View</p>} />
          <SettingsDropdown options={optionsOptions} onClick={handleDropdownClick} component={<p className='text-sm'>Options</p>} />
        </div>
      </nav>
      <div className='flex-1 fixed w-full h-[calc(100vh-var(--navbar-height))] overflow-auto top-[var(--navbar-height)]'>{children}</div>
    </div>
  );
};

export default Layout;
