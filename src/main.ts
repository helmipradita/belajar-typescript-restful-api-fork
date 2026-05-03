import {web} from "./application/web";
import {logger} from "./application/logging";

const PORT = process.env.PORT || 8888;

web.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
})
