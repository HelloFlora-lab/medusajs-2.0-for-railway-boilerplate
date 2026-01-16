import { MedusaService } from "@medusajs/framework/utils"

import {Florist} from "./models/florist"

class FloristModuleService extends MedusaService({
  Florist,
}) {}



export default FloristModuleService