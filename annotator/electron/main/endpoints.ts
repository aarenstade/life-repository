import registerDatabaseEndpoints from "../endpoints/database";
import registerFileIoEndpoints from "../endpoints/file_io";
import registerProcessingEndpoints from "../endpoints/processing";

const initializeEndpoints = () => {
  registerDatabaseEndpoints();
  registerFileIoEndpoints();
  registerProcessingEndpoints();
};

export default initializeEndpoints;
