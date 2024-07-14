import { Profile } from "@/types/profile";
import { FC } from "react";
type ProfileDescriptionProps = {
  profile: Profile;
};
const convertGender = (gender: number) => {
  switch (gender) {
    case 0:
      return "himself";
    case 1:
      return "herself";
    default:
      return "themselves";
  }
};

const ProfileDescription: FC<ProfileDescriptionProps> = ({ profile }) => {
  return (
    <div className="p-4">
      <div className="pb-2 border-b-2">
        <h1 className="text-xs uppercase">Achievements</h1>
        <div className="flex justify-around">
          <div className="flex flex-col items-center text-xs">
            <p className="text-sm font-semibold">{profile.postCount}</p>
            <p>Posts</p>
          </div>
          <div className="flex flex-col items-center text-xs">
            <p className="text-sm font-semibold">{profile.commentCount}</p>
            <p>Comments</p>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h1 className="text-xs uppercase">About me</h1>
        <p className="text-xs">
          {profile.bio ||
            `User did not talk about ${convertGender(profile.gender)}`}
        </p>
      </div>
    </div>
  );
};

export default ProfileDescription;
