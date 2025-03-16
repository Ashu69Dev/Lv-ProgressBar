# Lv-ProgressBar
# 🕹️ FiveM Progress Bar  

A dynamic, customizable progress bar for FiveM/QBCore. Perfect for immersive roleplay interactions!  

![Progress Bar Demo](https://via.placeholder.com/800x400.png?text=Progress+Bar+Demo+GIF)  

## ✨ **Features**    
- **Step Visualization**: Dynamic steps fill up as progress advances.  
- **Real-Time Percentage**: Clean percentage display with smooth animations.  
- **Cancel Support**: Actions can be interrupted, resetting the UI.  
- **Easy Integration**: Designed for QB-Core but adaptable to any framework.  

## 🛠️ **Installation**  
1. Download the `progressbar` folder.  
2. Add it to your FiveM server’s `resources` directory.  
3. Add `ensure progressbar` to your `server.cfg`.  
4. Trigger the progress bar in-game with:  
```lua
exports['progressbar']:Progress({
    label = "Repairing Vehicle",
    duration = 10000, -- 10 seconds
}, function(cancelled) 
    if not cancelled then 
        -- Action completed
    end
end)

Modification
.progress-step.active {
    background-color: #FF0000; /* Red progress steps */
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); /* Glow effect */
}

