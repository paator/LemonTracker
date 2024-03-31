#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

fn create_app_menu() -> Menu {
    return Menu::new()
        .add_submenu(Submenu::new(
            "App",
            Menu::new()
				.add_native_item(MenuItem::About("Lemon Tracker".to_string(), AboutMetadata::default()))
				.add_native_item(MenuItem::Separator)
				.add_native_item(MenuItem::Quit)),
        )
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(CustomMenuItem::new("new".to_string(), "New module").accelerator("CmdOrCtrl+N"))
                .add_item(CustomMenuItem::new("open".to_string(), "Open module").accelerator("CmdOrCtrl+O"))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("save".to_string(), "Save").accelerator("CmdOrCtrl+S")),
        ));
}

fn main() {
    tauri::Builder::default()
        .menu(create_app_menu())
		.on_menu_event(|event| {
			let event_name = event.menu_item_id();
			event.window().emit("menu", event_name).unwrap();
			match event_name {
				_ => {}
			}
		})
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
