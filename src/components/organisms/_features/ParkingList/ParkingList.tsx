/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import PageData from "@/data/dashboard.json";
import styles from "./ParkingList.module.css";
import { Button, Loader } from "@/components/atoms";
import { colors } from "@/constants/colors";
import { formatDate } from "@/utils/formatDate";
import { Filters } from "../Filters";
import useFilterStore from "@/zustand/filters";
import { Status, ParkingListResultProps } from "@/types/parkingSessions";
import { capitalize } from "@/utils/capitalize";
import {
  filterSessionType,
  filterStatus,
  filterVehicleType,
  handleSortBy,
} from "./functions";
import { LIST_SEARCH_LIMIT } from "@/constants/parkingSessions";
import { useSessionEndParking } from "@/tanstack/mutations/sessionEndParking";

interface ParkingListProps {
  listResult: ParkingListResultProps[];
  isLoading: boolean;
  fetchMore?: () => void;
}

const getStatusColor = (status: Status) => {
  return status === Status.Available ? colors.green : colors.red;
};

export const ParkingList: React.FC<ParkingListProps> = ({
  listResult = [],
  isLoading,
  fetchMore,
}) => {
  const { mutateAsync, isPending } = useSessionEndParking();
  const { searchQuery, sessionType, sortBy, status, vehicleType } =
    useFilterStore();

  const listResultFiltered =
    listResult
      .filter((item) => {
        const isSessionType = filterSessionType(item, sessionType);
        const isStatus = filterStatus(item, status);
        const isVehicleType = filterVehicleType(item, vehicleType);

        if (!isSessionType || !isStatus || !isVehicleType) {
          return false;
        }

        return true;
      })
      .filter((item) =>
        item.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => handleSortBy(a, b, sortBy)) || [];

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (Math.round(scrollTop) + clientHeight >= scrollHeight && !isLoading) {
      fetchMore?.();
    }
  };

  const handleEndSession = async (id: string) => {
    await mutateAsync({ parkingSessionId: id });
  };

  useEffect(() => {
    if (listResultFiltered.length < LIST_SEARCH_LIMIT && !isLoading) {
      fetchMore?.();
    }
  }, [isLoading, listResultFiltered]);

  return (
    <>
      <Filters />

      <div className={styles.table_container} onScroll={handleScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{PageData.list.columns.parkingSpace}</th>
              <th>{PageData.list.columns.sessionType}</th>
              <th>{PageData.list.columns.status}</th>
              <th>{PageData.list.columns.startTime}</th>
              <th>{PageData.list.columns.endTime}</th>
              <th>{PageData.list.columns.vehicleType}</th>
              <th>{PageData.list.columns.licensePlate}</th>
              <th>{PageData.list.columns.action.label}</th>
            </tr>
          </thead>
          <tbody>
            {listResultFiltered.map((item, index) => (
              <tr key={index}>
                <td>{item.parkingSpace}</td>
                <td>{item.sessionType}</td>
                <td
                  className={styles.status}
                  style={{
                    color: getStatusColor(item.status),
                  }}
                >
                  {item.status}
                </td>
                <td>{item.startTime ? formatDate(item.startTime) : null}</td>
                <td>{item.endTime ? formatDate(item.endTime) : null}</td>
                <td>{capitalize(item.vehicleType)}</td>
                <td>{item.licensePlate}</td>
                <td>
                  {item.status === Status.Occupied && (
                    <Button
                      color="danger"
                      onClick={() => handleEndSession(item.parkingSessionId)}
                      disabled={isPending}
                    >
                      {PageData.list.columns.action.buttons.endParking}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <Loader />}
      </div>
    </>
  );
};
