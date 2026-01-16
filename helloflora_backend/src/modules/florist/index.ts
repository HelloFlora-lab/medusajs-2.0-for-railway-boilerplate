import { Module } from "@medusajs/framework/utils"
import FloristModuleService from "./service"

export const FLORIST_MODULE = "Florist"

export default Module(FLORIST_MODULE, {
  service: FloristModuleService,
})