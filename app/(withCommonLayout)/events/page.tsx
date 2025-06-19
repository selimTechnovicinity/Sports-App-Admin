"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import API from "@/lib/axios-client";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit,
  FiHome,
  FiMapPin,
  FiPlus,
  FiRepeat,
  FiTrash2,
} from "react-icons/fi";
import Select from "react-select";
import { toast } from "react-toastify";

dayjs.locale("en");
const localizer = dayjsLocalizer(dayjs);

interface Event {
  _id: string;
  team_id: {
    _id: string;
    team_name: string;
    image: string;
  };
  opponent_team_id: {
    _id: string;
    team_name: string;
    image: string;
  };
  event_type: string;
  home_away: string;
  start_date: string;
  duration: number;
  arrive_time: number;
  all_day: boolean;
  repeats: string;
  location: string;
  image: string;
  notes: string;
  createdAt: string;
}

interface TeamOption {
  value: string;
  label: string;
  image?: string;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [eventTypes, setEventTypes] = useState([
    { value: "Game", label: "Game" },
    { value: "Practice", label: "Practice" },
    { value: "Other", label: "Other" },
  ]);
  const [repeatOptions, setRepeatOptions] = useState([
    { value: "Never", label: "Never" },
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    fetchEvents();
    fetchTeams();
  }, [pagination.currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/events?page=${pagination.currentPage}&limit=${pagination.limit}`
      );
      setEvents(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(
        res.data.data.map((team: any) => ({
          value: team._id,
          label: team.team_name,
          image: team.image,
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch teams");
    }
  };

  const fetchEventDetails = async (id: string) => {
    try {
      const res = await API.get(`/events/${id}`);
      setSelectedEvent(res.data.data);
      resetFormWithEventData(res.data.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch event details");
    }
  };

  const resetFormWithEventData = (event: Event) => {
    reset({
      team_id: event.team_id._id,
      opponent_team_id: event.opponent_team_id?._id || null,
      event_type: event.event_type,
      home_away: event.home_away,
      start_date: dayjs(event.start_date).format("YYYY-MM-DDTHH:mm"),
      duration: event.duration,
      arrive_time: event.arrive_time,
      all_day: event.all_day,
      repeats: event.repeats,
      location: event.location,
      image: event.image,
      notes: event.notes,
    });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        all_day: data.all_day === "true" || data.all_day === true,
        opponent_team_id: data.opponent_team_id || null,
      };

      if (isEditing && selectedEvent) {
        console.log(formattedData);
        await API.post(`/events/${selectedEvent._id}`, formattedData);
        toast.success("Event updated successfully");
      } else {
        await API.post("/events", formattedData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event created successfully");
      }

      fetchEvents();
      setIsModalOpen(false);
      setIsDetailModalOpen(false);
      setIsEditing(false);
      reset();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update event" : "Failed to create event"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      fetchEvents();
      setIsDetailModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMMM D, YYYY h:mm A");
  };

  const CustomOption = ({ innerProps, label, data }: any) => (
    <div
      {...innerProps}
      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
    >
      {data.image && (
        <Image
          src={data.image}
          alt={label}
          width={24}
          height={24}
          className="w-6 h-6 rounded-full mr-2"
        />
      )}
      <span>{label}</span>
    </div>
  );

  const handleSelectEvent = (event: any) => {
    fetchEventDetails(event.resource._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Events Management
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
                reset();
              }}
              className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus /> Create Event
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Events List */}
            <div className="space-y-4 mb-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => fetchEventDetails(event._id)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              event.event_type === "Game"
                                ? "bg-blue-100 text-blue-800"
                                : event.event_type === "Practice"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {event.event_type}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              event.home_away === "Home"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {event.home_away}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold">
                          {event.team_id.team_name} vs{" "}
                          {event.opponent_team_id?.team_name || "TBD"}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-2">
                          <FiCalendar className="mr-2" />
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <FiMapPin className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {event.team_id.image ? (
                              <Image
                                src={event.team_id.image}
                                alt={event.team_id.team_name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">
                                {event.team_id.team_name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-700">vs</span>
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {event.opponent_team_id?.image ? (
                              <Image
                                src={event.opponent_team_id.image}
                                alt={event.opponent_team_id.team_name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">
                                {event.opponent_team_id?.team_name
                                  .substring(0, 2)
                                  .toUpperCase() || "TBD"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.currentPage - 1))
                  }
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 mx-4 my-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        pagination.totalPages,
                        pagination.currentPage + 1
                      )
                    )
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalItems}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">First</span>
                      <FiChevronsLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, pagination.currentPage - 1)
                        )
                      }
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.currentPage === pageNum
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.min(
                            pagination.totalPages,
                            pagination.currentPage + 1
                          )
                        )
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Last</span>
                      <FiChevronsRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Create/Edit Event Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            reset();
          }}
          title={isEditing ? "Edit Event" : "Create New Event"}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                <Select
                  options={teams}
                  components={{ Option: CustomOption }}
                  onChange={(selected: any) =>
                    setValue("team_id", selected?.value)
                  }
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={false}
                />
                {errors.team_id && (
                  <p className="mt-1 text-sm text-red-600">Team is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opponent Team (Optional)
                </label>
                <Select
                  options={teams}
                  components={{ Option: CustomOption }}
                  onChange={(selected: any) =>
                    setValue("opponent_team_id", selected?.value)
                  }
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  {...register("event_type", {
                    required: "Event type is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.event_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.event_type.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home/Away
                </label>
                <select
                  {...register("home_away", {
                    required: "Home/Away is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Home">Home</option>
                  <option value="Away">Away</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register("start_date", {
                    required: "Start date is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.start_date.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  {...register("duration", {
                    required: "Duration is required",
                    min: {
                      value: 1,
                      message: "Duration must be at least 1 minute",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.duration.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrive Time (minutes before)
                </label>
                <input
                  type="number"
                  {...register("arrive_time", {
                    required: "Arrive time is required",
                    min: {
                      value: 0,
                      message: "Arrive time cannot be negative",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.arrive_time && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.arrive_time.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  All Day Event
                </label>
                <select
                  {...register("all_day")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeats
                </label>
                <select
                  {...register("repeats")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {repeatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message as string}
                  </p>
                )}
              </div>

              {/* <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Event Details Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setIsEditing(false);
          }}
          title={isEditing ? "Edit Event" : "Event Details"}
          size="lg"
        >
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Same form as create but with existing values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <Select
                    options={teams}
                    components={{ Option: CustomOption }}
                    onChange={(selected: any) =>
                      setValue("team_id", selected?.value)
                    }
                    defaultValue={teams.find(
                      (t) => t.value === selectedEvent?.team_id._id
                    )}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opponent Team (Optional)
                  </label>
                  <Select
                    options={teams}
                    components={{ Option: CustomOption }}
                    onChange={(selected: any) =>
                      setValue("opponent_team_id", selected?.value)
                    }
                    defaultValue={
                      selectedEvent?.opponent_team_id
                        ? teams.find(
                            (t) =>
                              t.value === selectedEvent?.opponent_team_id._id
                          )
                        : null
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable
                  />
                </div>

                {/* Other fields similar to create modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    {...register("event_type", {
                      required: "Event type is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.event_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.event_type.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home/Away
                  </label>
                  <select
                    {...register("home_away", {
                      required: "Home/Away is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Away">Away</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register("start_date", {
                      required: "Start date is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.start_date.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    {...register("duration", {
                      required: "Duration is required",
                      min: {
                        value: 1,
                        message: "Duration must be at least 1 minute",
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.duration.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrive Time (minutes before)
                  </label>
                  <input
                    type="number"
                    {...register("arrive_time", {
                      required: "Arrive time is required",
                      min: {
                        value: 0,
                        message: "Arrive time cannot be negative",
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.arrive_time && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.arrive_time.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    All Day Event
                  </label>
                  <select
                    {...register("all_day")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeats
                  </label>
                  <select
                    {...register("repeats")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {repeatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    {...register("location", {
                      required: "Location is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedEvent!._id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  <FiTrash2 /> Delete Event
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : selectedEvent ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                        {selectedEvent.team_id.image ? (
                          <Image
                            src={selectedEvent.team_id.image}
                            alt={selectedEvent.team_id.team_name}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-2xl">
                            {selectedEvent.team_id.team_name
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-center">
                        {selectedEvent.team_id.team_name}
                      </h4>
                      <span className="text-sm text-gray-500">Your Team</span>
                    </div>

                    <div className="my-4 flex justify-center">
                      <span className="bg-gray-200 px-3 py-1 rounded-md">
                        vs
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                        {selectedEvent.opponent_team_id?.image ? (
                          <Image
                            src={selectedEvent.opponent_team_id.image}
                            alt={selectedEvent.opponent_team_id.team_name}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-2xl">
                            {selectedEvent.opponent_team_id?.team_name
                              .substring(0, 2)
                              .toUpperCase() || "TBD"}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-center">
                        {selectedEvent.opponent_team_id?.team_name || "TBD"}
                      </h4>
                      <span className="text-sm text-gray-500">Opponent</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        selectedEvent.event_type === "Game"
                          ? "bg-blue-100 text-blue-800"
                          : selectedEvent.event_type === "Practice"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {selectedEvent.event_type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        selectedEvent.home_away === "Home"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedEvent.home_away === "Home" ? (
                        <span className="flex items-center gap-1">
                          <FiHome className="inline" /> Home
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FiHome className="inline" /> Away
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FiCalendar className="mt-1 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {formatDate(selectedEvent.start_date)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {selectedEvent.duration} minutes
                          {selectedEvent.arrive_time > 0 &&
                            ` (Arrive ${selectedEvent.arrive_time} minutes early)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiMapPin className="mt-1 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{selectedEvent.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiRepeat className="mt-1 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Repeats</p>
                        <p className="font-medium">{selectedEvent.repeats}</p>
                      </div>
                    </div>

                    {selectedEvent.notes && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-500">📝</div>
                        <div>
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="font-medium">{selectedEvent.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <FiEdit /> Edit Event
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
}
