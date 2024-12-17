import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { Developer } from "../types";

interface DeveloperFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (developer: Partial<Developer>) => Promise<Developer | undefined>;
  developer?: Developer;
}

const ROLES = [
  "Junior FrontEnd Developer",
  "Mid FrontEnd Developer",
  "Senior FrontEnd Developer",
  "Junior BackEnd Developer",
  "Mid BackEnd Developer",
  "Senior BackEnd Developer",
  "Junior FullStack Developer",
  "Mid FullStack Developer",
  "Senior FullStack Developer",
  "FrontEnd Team Leader",
  "Backend Team Leader",
] as const;

const TEAMS = ["FrontEnd", "BackEnd"] as const;

const DeveloperForm: React.FC<DeveloperFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  developer,
}) => {
  const toast = useToast();
  const [formData, setFormData] = React.useState<Partial<Developer>>({
    name: developer?.name || "",
    role: developer?.role || undefined,
    team: developer?.team || undefined,
    employmentStatus: developer?.employmentStatus || "active",
    skills: developer?.skills || [],
    joinDate: developer?.joinDate || new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    let status: "success" | "error" = "success";
    e.preventDefault();
    try {
      const result = await onSubmit(formData);
      if (result === undefined) {
        status = "error";
      }
      toast({
        title:
          status === "success"
            ? developer
              ? "Developer Updated"
              : "Developer Added"
            : "Something went wrong",
        status,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting developer form:", error);
      status = "error";
      toast({
        title: "Error submitting developer forms",
        status,
        duration: 3000,
      });
    }
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((skill) => skill.trim()),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (developer) {
      setFormData(developer);
    }
  }, [developer]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {developer ? "Edit Developer" : "Add New Developer"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} pb={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Team</FormLabel>
                <Select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                >
                  <option value="">Select Team</option>
                  {TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Employment Status</FormLabel>
                <Select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="vacation">Vacation</option>
                  <option value="leave">Leave</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Skills (comma-separated)</FormLabel>
                <Input
                  name="skills"
                  value={formData.skills?.join(", ")}
                  onChange={handleChange}
                  placeholder="React, TypeScript, Node.js"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Join Date</FormLabel>
                <Input
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                {developer ? "Update Developer" : "Add Developer"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeveloperForm;
