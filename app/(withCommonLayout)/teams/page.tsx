"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import API from "@/lib/axios-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRunning,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import Select from "react-select";
import { toast } from "react-toastify";

interface Team {
  _id: string;
  team_name: string;
  team_place: string;
  image: string;
  game_type: {
    _id: string;
    title: string;
    image: string;
  } | null;
  team_type: {
    _id: string;
    title: string;
    image: string;
  } | null;
  age_type: {
    _id: string;
    title: string;
    image: string;
  } | null;
  season_type: {
    _id: string;
    title: string;
    image: string;
  } | null;
  players_id: Array<{
    _id: string;
    first_name: string;
    last_name: string;
    image: string | null;
  }>;
  createdAt: string;
}

interface OptionType {
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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
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
  const [options, setOptions] = useState({
    gameTypes: [] as OptionType[],
    teamTypes: [] as OptionType[],
    ageTypes: [] as OptionType[],
    seasonTypes: [] as OptionType[],
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    fetchTeams();
    fetchDropdownOptions();
  }, [pagination.currentPage]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/teams?page=${pagination.currentPage}&limit=${pagination.limit}`
      );
      setTeams(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const [gameTypes, teamTypes, ageTypes, seasonTypes] = await Promise.all([
        API.get("/game-types"),
        API.get("/team-types"),
        API.get("/age-types"),
        API.get("/season-types"),
      ]);

      setOptions({
        gameTypes: gameTypes.data.data.map((item: any) => ({
          value: item._id,
          label: item.title,
          image: item.image,
        })),
        teamTypes: teamTypes.data.data.map((item: any) => ({
          value: item._id,
          label: item.title,
          image: item.image,
        })),
        ageTypes: ageTypes.data.data.map((item: any) => ({
          value: item._id,
          label: item.title,
          image: item.image,
        })),
        seasonTypes: seasonTypes.data.data.map((item: any) => ({
          value: item._id,
          label: item.title,
          image: item.image,
        })),
      });
    } catch (error) {
      toast.error("Failed to fetch dropdown options");
    }
  };

  const fetchTeamDetails = async (id: string) => {
    try {
      const res = await API.get(`/teams/${id}`);
      setSelectedTeam(res.data.data);
      resetFormWithTeamData(res.data.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch team details");
    }
  };

  const resetFormWithTeamData = (team: Team) => {
    reset({
      team_name: team.team_name,
      team_place: team.team_place,
      image: team.image,
      game_type: team.game_type ? team.game_type._id : null,
      team_type: team.team_type ? team.team_type._id : null,
      age_type: team.age_type ? team.age_type._id : null,
      season_type: team.season_type ? team.season_type._id : null,
    });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        image: data.image[0] || null,
        game_type: data.game_type || null,
        team_type: data.team_type || null,
        age_type: data.age_type || null,
        season_type: data.season_type || null,
      };

      if (isEditing && selectedTeam) {
        await API.post(`/teams/${selectedTeam._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Team updated successfully");
      } else {
        await API.post("/teams", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Team created successfully");
      }

      fetchTeams();
      setIsModalOpen(false);
      setIsDetailModalOpen(false);
      setIsEditing(false);
      reset();
    } catch (error) {
      toast.error(
        isEditing
          ? (error as string | "Failed to update team")
          : "Failed to create team"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/teams/${id}`);
      toast.success("Team deleted successfully");
      fetchTeams();
      setIsDetailModalOpen(false);
    } catch (error) {
      toast.error(error as string | "Failed to delete team");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Teams Management</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditing(false);
              reset();
            }}
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <FiPlus /> Create Team
          </button>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-950"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {teams.map((team) => (
                <div
                  key={team._id}
                  onClick={() => fetchTeamDetails(team._id)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    {team.image ? (
                      <Image
                        src={team.image}
                        alt={team.team_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {team.team_name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{team.team_place}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaRunning className="mr-2" />
                      <span>{team.game_type?.title || "No game type"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>{team.players_id.length} players</span>
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

        {/* Create/Edit Team Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            reset();
          }}
          title={isEditing ? "Edit Team" : "Create Team"}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name
              </label>
              <input
                {...register("team_name", {
                  required: "Team name is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter team name"
              />
              {errors.team_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.team_name.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Location
              </label>
              <input
                {...register("team_place", {
                  required: "Location is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter team location"
              />
              {errors.team_place && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.team_place.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Type
              </label>
              <Select
                options={options.gameTypes}
                components={{ Option: CustomOption }}
                onChange={(selected: any) =>
                  setValue("game_type", selected?.value)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Type
              </label>
              <Select
                options={options.teamTypes}
                components={{ Option: CustomOption }}
                onChange={(selected: any) =>
                  setValue("team_type", selected?.value)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Type
              </label>
              <Select
                options={options.ageTypes}
                components={{ Option: CustomOption }}
                onChange={(selected: any) =>
                  setValue("age_type", selected?.value)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Season Type
              </label>
              <Select
                options={options.seasonTypes}
                components={{ Option: CustomOption }}
                onChange={(selected: any) =>
                  setValue("season_type", selected?.value)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: "100px", // Set your desired max height
                    overflowY: "auto", // Enable vertical scrolling
                  }),
                }}
              />
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
                {isEditing ? "Update Team" : "Create Team"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Team Details Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setIsEditing(false);
          }}
          title={isEditing ? "Edit Team" : "Team Details"}
          size="lg"
        >
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  {...register("team_name", {
                    required: "Team name is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Location
                </label>
                <input
                  {...register("team_place", {
                    required: "Location is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game Type
                </label>
                <Select
                  options={options.gameTypes}
                  components={{ Option: CustomOption }}
                  onChange={(selected: any) =>
                    setValue("game_type", selected?.value)
                  }
                  defaultValue={
                    selectedTeam?.game_type
                      ? {
                          value: selectedTeam.game_type._id,
                          label: selectedTeam.game_type.title,
                          image: selectedTeam.game_type.image,
                        }
                      : null
                  }
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Type
                </label>
                <Select
                  options={options.teamTypes}
                  components={{ Option: CustomOption }}
                  onChange={(selected: any) =>
                    setValue("team_type", selected?.value)
                  }
                  defaultValue={
                    selectedTeam?.team_type
                      ? {
                          value: selectedTeam.team_type._id,
                          label: selectedTeam.team_type.title,
                          image: selectedTeam.team_type.image,
                        }
                      : null
                  }
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Type
                </label>
                <Select
                  options={options.ageTypes}
                  components={{ Option: CustomOption }}
                  onChange={(selected: any) =>
                    setValue("age_type", selected?.value)
                  }
                  defaultValue={
                    selectedTeam?.age_type
                      ? {
                          value: selectedTeam.age_type._id,
                          label: selectedTeam.age_type.title,
                          image: selectedTeam.age_type.image,
                        }
                      : null
                  }
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season Type
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Season Type
                  </label>
                  <Select
                    options={options.seasonTypes}
                    components={{ Option: CustomOption }}
                    onChange={(selected: any) =>
                      setValue("season_type", selected?.value)
                    }
                    defaultValue={
                      selectedTeam?.season_type
                        ? {
                            value: selectedTeam.season_type._id,
                            label: selectedTeam.season_type.title,
                            image: selectedTeam.season_type.image,
                          }
                        : null
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable
                    styles={{
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: "100px", // Set your desired max height
                        overflowY: "auto", // Enable vertical scrolling
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedTeam!._id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  <FiTrash2 /> Delete Team
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : selectedTeam ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                    {selectedTeam.image ? (
                      <Image
                        src={selectedTeam.image}
                        alt={selectedTeam.team_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedTeam.team_name}
                    </h2>
                    <p className="text-gray-600">{selectedTeam.team_place}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <FaRunning className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Game Type</p>
                        <p className="font-medium">
                          {selectedTeam.game_type?.title || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Team Type</p>
                        <p className="font-medium">
                          {selectedTeam.team_type?.title || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Age Type</p>
                        <p className="font-medium">
                          {selectedTeam.age_type?.title || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Season</p>
                        <p className="font-medium">
                          {selectedTeam.season_type?.title || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">
                      {formatDate(selectedTeam.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Players ({selectedTeam.players_id.length})
                </h3>
                {selectedTeam.players_id.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedTeam.players_id.map((player) => (
                      <div
                        key={player._id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                      >
                        {player.image ? (
                          <Image
                            src={player.image}
                            alt={`${player.first_name} ${player.last_name}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {player.first_name.charAt(0)}
                            {player.last_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {player.first_name} {player.last_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No players in this team</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md hover:bg-blue-700"
                >
                  <FiEdit /> Edit Team
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
}
