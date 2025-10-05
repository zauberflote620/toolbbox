# The Visual-First Toolbox

Welcome to your reusable, methodology-led toolkit for conducting efficient and effective shop resets. This toolbox is designed to be adapted to any retail space by first understanding your unique constraints and goals.

## Summary of a-Method

This toolbox is built on the **Anchor-and-Spokes** methodology. After exploring five different credible reset methodologies, this approach was selected for its superior balance of visual clarity, flexibility, and its ability to create an intuitive shopping experience. It works by identifying key **Anchor** products or displays and surrounding them with complementary **Spoke** products, creating natural points of interest that guide customer flow.

## Visual Index of All Artifacts

| Artifact | Thumbnail (Low-Fi) | Purpose | Location |
|---|---|---|---|
| **Method Comparison** | `[Table]` | Shows the scoring and decision process for selecting the reset methodology. | `1_Methodology/` |
| **Decision Record** | `[Storyboard]` | Explains *why* the Anchor-and-Spokes method was chosen and how it works. | `1_Methodology/` |
| **Parameterization Model** | `[Diagram]` | Defines the configurable "knobs" that tune the reset plan. | `2_Configuration/` |
| **Constraints Intake** | `[Form]` | The user-fillable template to provide shop-specific constraints and priorities. | `2_Configuration/` |
| **Anchor & Spoke Map** | `[Map]` | The primary visual layout plan, showing where Anchors and Spokes are placed. | `3_Artifacts/templates/` |
| **Product Relationship Card**| `[Card]` | A detailed guide for merchandising a single Anchor and its Spokes. | `3_Artifacts/templates/` |
| **Validation Loop** | `[Checklist]` | A QA checklist and guide for validating the reset and providing feedback. | `4_Process/` |
| **Re-Run Guide** | `[Quickstart]` | A one-page guide for executing subsequent resets quickly. | `4_Process/` |

## How to Use This Toolbox

1.  **Start with Configuration:** Go to the `2_Configuration/` directory. Copy the `constraints.yaml.template` to `constraints.yaml` and fill it out with your shop's specific details. Then, review `config.yaml.template` and copy it to `config.yaml`, tuning the knobs to match your goals for the upcoming reset.
2.  **Generate Artifacts:** Run the (hypothetical) generation script. This will consume your configuration files and produce the final visual artifacts (the Map and Cards) in the `3_Artifacts/output/` directory.
3.  **Execute and Validate:** Use the generated artifacts to perform the reset. Then, use the `Validation_Loop.md` in the `4_Process/` directory to check your work and gather feedback for the next cycle.

## List of Placeholders

This toolbox uses `<PLACEHOLDER>` markers to indicate where your specific data is needed. You will find these in:

*   `constraints_intake.md`: For all your shop's physical and logistical details.
*   `rerun_guide.md`: For the specific command to run your generation script.
*   The artifact templates in `3_Artifacts/templates/`: These will be filled automatically by the generation script.

This modular, visual-first system is designed to make every shop reset faster, more strategic, and less stressful than the last.
