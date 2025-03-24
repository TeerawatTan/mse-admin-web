import React, { useEffect, useState } from "react";
import api from "../../api";
import { PageBreadcrumb } from "../../components";
interface Profile {
  userID: string
  hn: any
  titleName: any
  firstName: string
  lastName: string
  fullName: string
  idCard: string
  birthDate: string
  age: number
  gender: number
  agency: any
  workPlaceID: number
  workPlaceName: string
  jobTypeID: number
  jobTypeName: string
  phoneNo: any
  isActive: boolean
  createdDate: string
  createdBy: string
  count: number
  treatmentID: any
  treatmentName: string
  userName: string
  question40: string
  question2q: string
  question9q: number
  imageUrl: any
  questionSt5: number
  question8q: number
  questionGHQ28Group1: number
  questionGHQ28Group2: number
  questionGHQ28Group3: number
  questionGHQ28Group4: number
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>();

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/User/Profile`);
      if (!response.data) throw new Error(`Error ${response.status}`);
      const data: Profile = await response.data;
      setProfile(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Profile"
        name="Profile"
      />
      <div className="card">
        <div className="card-header">
          {profile ? <>
            <div className="flex gap-2 w-full mb-3">
              <div className="flex-1 w-full">
                <label htmlFor="hn" className="text-gray-800 text-sm font-medium mb-2 w-full">HN</label>
                <input
                  name="hn"
                  type="text"
                  placeholder="HN"
                  value={profile?.hn}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="idCard" className="text-gray-800 text-sm font-medium mb-2 w-full">เลขบัตรประชาชน</label>
                <input
                  name="idCard"
                  type="text"
                  placeholder="เลขบัตรประชาชน"
                  value={profile?.idCard}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
            </div>
            <div className="flex gap-2 w-full mb-3">
              <div className="flex-none">
                <label htmlFor="titleName" className="text-gray-800 text-sm font-medium mb-2 w-full">คำนำหน้า</label>
                <br />
                <input
                  name="titleName"
                  type="text"
                  placeholder="คำนำหน้า"
                  value={profile?.titleName}
                  className="border p-2 rounded w-75"
                  readOnly
                />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="firstName" className="text-gray-800 text-sm font-medium mb-2 w-full">ชื่อ</label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="ชื่อ"
                  value={profile?.firstName}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="lastName" className="text-gray-800 text-sm font-medium mb-2 w-full">สกุล</label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="สกุล"
                  value={profile?.lastName}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
            </div>
            <div className="flex gap-2 w-full mb-3">
              <div className="flex-1 w-full">
                <label htmlFor="phoneNo" className="text-gray-800 text-sm font-medium mb-2 w-full">โทรศัพท์</label>
                <input
                  name="phoneNo"
                  type="text"
                  placeholder="โทรศัพท์"
                  value={profile?.phoneNo}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="jobTypeName" className="text-gray-800 text-sm font-medium mb-2 w-full">ชื่อตำแหน่ง</label>
                <input
                  name="jobTypeName"
                  type="text"
                  placeholder="ชื่อตำแหน่ง"
                  value={profile?.jobTypeName}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="phoneNo" className="text-gray-800 text-sm font-medium mb-2 w-full">สังกัด</label>
                <input
                  name="phoneNo"
                  type="text"
                  placeholder="สังกัด"
                  value={profile?.agency}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
            </div>
            <div className="flex gap-2 w-full mb-3">
              <div className="flex-1 w-full">
                <label htmlFor="workPlaceName" className="text-gray-800 text-sm font-medium mb-2 w-full">ชื่อโรงพยาบาล</label>
                <input
                  name="workPlaceName"
                  type="text"
                  placeholder="ชื่อโรงพยาบาล"
                  value={profile?.workPlaceName}
                  className="border p-2 rounded w-full flex-1"
                  readOnly
                />
              </div>
            </div>

          </> : <div>Loading...</div>}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
