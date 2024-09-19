import React from "react";
import styles from "./Filters.module.css";
import { Selector, TextInput } from "@/components/molecules";
import useFilterStore, {
  SessionType,
  sortBy,
  Status,
  StoreVehicleType,
} from "@/zustand/filters";
import { VehicleType } from "@/types/api";

const sessionTypeOptions = [
  { value: "all", label: "All" },
  { value: "residents", label: "Residents" },
  { value: "non-residents-cars", label: "Non-Residents Cars" },
  { value: "non-residents-motorcycles", label: "Non-Residents Motorcycles" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
];

const vehicleOptions = [
  { value: "all", label: "All" },
  { value: VehicleType.CAR, label: VehicleType.CAR },
  { value: VehicleType.MOTOR, label: VehicleType.MOTOR },
];

const sortOptions = [
  { value: "parkingSpace", label: "Parking space" },
  { value: "status", label: "Status" },
  { value: "startTime", label: "Start time" },
  { value: "endTime", label: "End time" },
  { value: "vehicleType", label: "Vehicle" },
];

export const Filters = () => {
  const {
    searchQuery,
    sessionType,
    sortBy,
    status,
    vehicleType,
    setSearchQuery,
    setSessionType,
    setSortBy,
    setStatus,
    setVehicleType,
  } = useFilterStore();
  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectSessionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionType(e.target.value as SessionType);
  };

  const handleSelectStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as Status);
  };

  const handleSelectVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleType(e.target.value as StoreVehicleType);
  };

  const handleSelectSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as sortBy);
  };

  return (
    <div className={styles.filters}>
      <div style={{ flex: 0.5 }}>
        <TextInput
          label="Search"
          name="search"
          placeholder="License plate/Parking space"
          onChange={handleChangeQuery}
          value={searchQuery}
          autoComplete="off"
        />
      </div>

      <Selector
        label="Session type"
        name="sessionType"
        options={sessionTypeOptions}
        onChange={handleSelectSessionType}
        value={sessionType}
      />
      <Selector
        label="Status"
        name="status"
        options={statusOptions}
        onChange={handleSelectStatus}
        value={status}
      />
      <Selector
        label="Vehicle"
        name="vehicle"
        options={vehicleOptions}
        onChange={handleSelectVehicle}
        value={vehicleType}
      />
      <Selector
        label="Sort by"
        name="sortBy"
        options={sortOptions}
        onChange={handleSelectSortBy}
        value={sortBy}
      />
    </div>
  );
};
