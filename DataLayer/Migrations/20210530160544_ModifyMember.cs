using Microsoft.EntityFrameworkCore.Migrations;

namespace DataLayer.Migrations
{
    public partial class ModifyMember : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "MemberShips");

            migrationBuilder.RenameColumn(
                name: "TrainingPurpose",
                table: "MemberShips",
                newName: "Address2");

            migrationBuilder.RenameColumn(
                name: "PhysicalCondition",
                table: "MemberShips",
                newName: "Address1");

            migrationBuilder.AddColumn<bool>(
                name: "Aliments",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Athletics",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Body",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Cholesterol",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Complaint",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Diabets",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Discomfort",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Doctors",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Fat",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Fitness",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Herina",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Incorrigible",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Musele",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Pain",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Pregnant",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Pressure",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Smoking",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Surgery",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Trace",
                table: "MemberShips",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aliments",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Athletics",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Body",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Cholesterol",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Complaint",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Diabets",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Discomfort",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Doctors",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Fat",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Fitness",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Herina",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Incorrigible",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Musele",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Pain",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Pregnant",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Pressure",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Smoking",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Surgery",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "Trace",
                table: "MemberShips");

            migrationBuilder.RenameColumn(
                name: "Address2",
                table: "MemberShips",
                newName: "TrainingPurpose");

            migrationBuilder.RenameColumn(
                name: "Address1",
                table: "MemberShips",
                newName: "PhysicalCondition");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "MemberShips",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
