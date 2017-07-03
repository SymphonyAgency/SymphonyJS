import SymphonyJs from './symphonyFunctionsClass'
import Custom from './extensions/custom'
import EqualizeHeights from './extensions/equalizeHeights'
import EqualizeSides from './extensions/equalizeSides'
import Toggle from './extensions/toggle'

SymphonyJs.prototype.custom = Custom
SymphonyJs.prototype.equalizeHeights = EqualizeHeights
SymphonyJs.prototype.equalizeSides = EqualizeSides
SymphonyJs.prototype.toggle = Toggle

export default SymphonyJs