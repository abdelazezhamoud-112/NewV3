import UserProfileCard from "../UserProfileCard";

export default function UserProfileCardExample() {
  return (
    <div className="p-6 bg-background space-y-4 max-w-2xl">
      <UserProfileCard
        name="د. محمد حسن إبراهيم"
        userType="doctor"
        email="dr.mohamed@hospital.com"
        phone="0100-123-4567"
        joinDate="2020-01-15"
      />
      <UserProfileCard
        name="أحمد محمد علي"
        userType="patient"
        email="ahmed@email.com"
        phone="0111-234-5678"
        joinDate="2025-10-01"
      />
    </div>
  );
}
