import useSWR, { mutate } from "swr";
import { API_GET_PETS_URL } from "../../config";
import { fetcherLostPetsApi } from "../../lib/axios";
import { generateRandomUUID } from "../../lib/uuid";
import { createPet } from "../repositories/PetsReposity";

export const usePets = () => {
  const { data } = useSWR(API_GET_PETS_URL, fetcherLostPetsApi);

  const addPet = (pet) => {
    const optimisticData = {
      pets: [...(data.pets || []), { ...pet, _id: generateRandomUUID() }],
      status: "OK",
    };
    return mutate(
      API_GET_PETS_URL,
      createPet(pet).then(() => optimisticData),
      {
        optimisticData,
        rollbackOnError: true,
      }
    );
  };

  return {
    pets: data?.pets || [],
    addPet,
  };
};