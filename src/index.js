import SymphonyFunctions from './symphonyFunctionsClass'
import Custom from './extensions/custom'
import EqualizeHeights from './extensions/equalizeHeights'
import EqualizeSides from './extensions/equalizeSides'
import Toggle from './extensions/toggle'

export default function SymphonyJs(options) {
    SymphonyFunctions.prototype.custom = Custom
    SymphonyFunctions.prototype.equalizeHeights = EqualizeHeights
    SymphonyFunctions.prototype.equalizeSides = EqualizeSides
    SymphonyFunctions.prototype.toggle = Toggle

    return new SymphonyClass(options)
}

window.SymphonyJs = SymphonyJs

