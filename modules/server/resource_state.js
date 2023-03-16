const kvp = GetResourceKvpString("resource_states");
var alteredStates = [];

onNet("onResourceStop", (rName) => {
    if (!alteredStates.includes(rName)) {
        alteredStates.push(rName);
    }
    if (rName === GetCurrentResourceName()) {
        SetResourceKvp("resource_states", JSON.stringify(alteredStates));
    }
});

onNet("onResourceStart", (rName) => {
    if (rName === GetCurrentResourceName()) {
        alteredStates = kvp ? JSON.parse(kvp) : [];
    }
    setTimeout(() => {
        alteredStates = alteredStates.filter(entry => entry != rName);
    }, 5000); // If your server has a very laggy connection this might be too low.
});

onNet("onResourceListRefresh", () => {
    DeleteResourceKvp("resource_states");
    alteredStates = [];
});

onNet("icarus:9045go7a03c5", (rName) => {
    if (alteredStates.includes(rName)) {
        return;
    }
    if (GetResourceState(rName) === "started" && GetPlayerPed(source) != 0) {
        emit("icarus:my602oxd71pv", source, "Resource Stopped [C1]", false, [rName]);
    }
});